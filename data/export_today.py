# export_today.py
# Export ONLY today's participants (EST day) with the SAME columns/order as export_merged.py,
# then email the CSV via SendGrid. Logs every run to console and export_today.log.

import os, csv, base64
from collections import defaultdict
from datetime import datetime, timedelta, time
from zoneinfo import ZoneInfo

from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, From, Attachment, FileContent, FileName, FileType, Disposition

# ------------------ CONFIG ------------------
load_dotenv()

DB_NAME = "test"

MONGO_URI = os.environ["MONGO_URI"]
SENDGRID_API_KEY = os.environ["SENDGRID_API_KEY"]
EMAIL_FROM = os.environ["EMAIL_FROM"]                 # must be verified in SendGrid
EMAIL_TO = [e.strip() for e in os.environ["EMAIL_TO"].split(",")]  # one or many, comma-separated

LOG_FILE = "export_today.log"


# ------------------ HELPERS ------------------
def log(msg: str):
    """Log to console and append to export_today.log with timestamp."""
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(line + "\n")


def _first3_usecases(usecases):
    """Return up to 3 (use, explanation) pairs from a list that may contain dicts/strings."""
    out = []
    for uc in usecases:
        if isinstance(uc, dict):
            use = uc.get("use", uc.get("text", ""))
            expl = uc.get("explanation", "")
        else:
            use = "" if uc is None else str(uc)
            expl = ""
        out.append((use, expl))
        if len(out) == 3:
            break
    return out


def _split_chats(chat_docs_for_task):
    """Split chat messages into user vs gpt buckets."""
    user_msgs, gpt_msgs = [], []
    for doc in chat_docs_for_task:
        for m in doc.get("chatMessages", []):
            msg = m.get("message", m.get("text", m if isinstance(m, str) else ""))
            sender = (m.get("sender") or "").lower()
            direction = (m.get("direction") or "").lower()
            if sender == "user" or direction == "outgoing":
                user_msgs.append("" if msg is None else str(msg))
            else:
                gpt_msgs.append("" if msg is None else str(msg))
    return user_msgs, gpt_msgs


def _est_bounds_today():
    """Return (start_utc, end_utc, date_label) for today in EST, converted to UTC."""
    est = ZoneInfo("America/New_York")
    today_est = datetime.now(est).date()
    start_est = datetime.combine(today_est, time.min, tzinfo=est)
    end_est = start_est + timedelta(days=1)
    return start_est.astimezone(ZoneInfo("UTC")), end_est.astimezone(ZoneInfo("UTC")), today_est.strftime("%Y-%m-%d")


def _master_fieldnames():
    """Exact header/order as export_merged.py."""
    fields = [
        "preSurveyId", "presurveyDate",
        "age","gender","race","experience","designExperience",
        "healthcareFamiliarity","automationFamiliarity","smartDevicesFamiliarity",
        # Task 1
        "task1PatentCategory","task1PatentName",
        "task1IdeasRound1.use1","task1IdeasRound1.explanation1",
        "task1IdeasRound1.use2","task1IdeasRound1.explanation2",
        "task1IdeasRound1.use3","task1IdeasRound1.explanation3"
    ]
    for t in (2, 3, 4):
        fields.extend([
            f"task{t}PatentCategory", f"task{t}PatentName", f"task{t}Level",
            f"task{t}UserChatCount", f"task{t}UserChatMessages",
            f"task{t}GPTChatCount", f"task{t}GPTChatMessages",
            f"task{t}IdeasRound1.use1", f"task{t}IdeasRound1.explanation1",
            f"task{t}IdeasRound1.use2", f"task{t}IdeasRound1.explanation2",
            f"task{t}IdeasRound1.use3", f"task{t}IdeasRound1.explanation3",
            f"task{t}IdeasRound2.use1", f"task{t}IdeasRound2.explanation1",
            f"task{t}IdeasRound2.use2", f"task{t}IdeasRound2.explanation2",
            f"task{t}IdeasRound2.use3", f"task{t}IdeasRound2.explanation3"
        ])
    fields.extend([
        "accuracy","helpfulness","inspiration","expansion","recombination","problems","improvements"
    ])
    return fields


# ------------------ CORE EXPORT ------------------
def export_today_csv(db):
    start_utc, end_utc, date_lbl = _est_bounds_today()

    todays_presurveys = list(db.presurveys.find({
        "createdAt": {"$gte": start_utc, "$lt": end_utc}
    }))

    if not todays_presurveys:
        return None, date_lbl, 0

    presurvey_ids = [ps["_id"] for ps in todays_presurveys]

    # patents lookup
    patents = {}
    for p in db.patents.find({}, {"_id": 1, "patentName": 1, "category": 1}):
        patents[p["_id"]] = {"name": p.get("patentName", ""), "category": p.get("category", "")}

    selections = {d["preSurveyId"]: d for d in db.patentselections.find({"preSurveyId": {"$in": presurvey_ids}})}
    posts = {d["preSurveyId"]: d for d in db.postsurveys.find({"preSurveyId": {"$in": presurvey_ids}})}

    aut_baseline = defaultdict(list)
    for d in db.auts.find({"preSurveyId": {"$in": presurvey_ids}}):
        aut_baseline[d["preSurveyId"]].append(d)

    aut_gpt = defaultdict(list)
    for d in db.aut_gpts.find({"preSurveyId": {"$in": presurvey_ids}}):
        aut_gpt[d["preSurveyId"]].append(d)

    chats = defaultdict(list)
    for d in db.chatmessages.find({"preSurveyId": {"$in": presurvey_ids}}):
        chats[d["preSurveyId"]].append(d)

    # build rows
    rows = []
    for pre in todays_presurveys:
        pid = pre["_id"]

        row = {k: "" for k in _master_fieldnames()}
        row["preSurveyId"] = str(pid)
        row["presurveyDate"] = pre.get("createdAt", "")
        if row["presurveyDate"]:
            try:
                row["presurveyDate"] = pre["createdAt"].strftime("%Y-%m-%d %H:%M:%S")
            except Exception:
                row["presurveyDate"] = str(pre["createdAt"])

        # presurvey demographics
        row["age"] = pre.get("age", "")
        row["gender"] = pre.get("gender", "")
        row["race"] = pre.get("race", "")
        row["experience"] = pre.get("experience", "")
        row["designExperience"] = pre.get("designExperience", "")
        row["healthcareFamiliarity"] = pre.get("healthcareFamiliarity", "")
        row["automationFamiliarity"] = pre.get("automationFamiliarity", "")
        row["smartDevicesFamiliarity"] = pre.get("smartDevicesFamiliarity", "")

        sel = selections.get(pid, {})

        # task 1
        t1_pat_id = sel.get("task1Patent")
        if isinstance(t1_pat_id, ObjectId) and t1_pat_id in patents:
            row["task1PatentName"] = patents[t1_pat_id]["name"]
            row["task1PatentCategory"] = patents[t1_pat_id]["category"]

        baseline_entries = aut_baseline.get(pid, [])
        if baseline_entries:
            uc_pairs = _first3_usecases(baseline_entries[0].get("useCases", []))
            for idx, (use, expl) in enumerate(uc_pairs, start=1):
                row[f"task1IdeasRound1.use{idx}"] = use
                row[f"task1IdeasRound1.explanation{idx}"] = expl

        # tasks 2-4
        for t in (2, 3, 4):
            pat_id = sel.get(f"task{t}Patent")
            if isinstance(pat_id, ObjectId) and pat_id in patents:
                row[f"task{t}PatentName"] = patents[pat_id]["name"]
                row[f"task{t}PatentCategory"] = patents[pat_id]["category"]
            row[f"task{t}Level"] = sel.get(f"task{t}Level", "")

            task_chat_docs = [d for d in chats.get(pid, []) if d.get("task") == t]
            user_msgs, gpt_msgs = _split_chats(task_chat_docs)
            row[f"task{t}UserChatCount"] = len(user_msgs)
            row[f"task{t}UserChatMessages"] = " | ".join(user_msgs)
            row[f"task{t}GPTChatCount"] = len(gpt_msgs)
            row[f"task{t}GPTChatMessages"] = " | ".join(gpt_msgs)

            for d in [doc for doc in aut_gpt.get(pid, []) if doc.get("task") == t]:
                rnd = d.get("round")
                if rnd not in (1, 2):
                    continue
                uc_pairs = _first3_usecases(d.get("useCases", []))
                for idx, (use, expl) in enumerate(uc_pairs, start=1):
                    row[f"task{t}IdeasRound{rnd}.use{idx}"] = use
                    row[f"task{t}IdeasRound{rnd}.explanation{idx}"] = expl

        post = posts.get(pid, {})
        row["accuracy"] = post.get("accuracy", "")
        row["helpfulness"] = post.get("helpfulness", "")
        row["inspiration"] = post.get("inspiration", "")
        row["expansion"] = post.get("expansion", "")
        row["recombination"] = post.get("recombination", "")
        row["problems"] = post.get("problems", "")
        row["improvements"] = post.get("improvements", "")

        rows.append(row)

    # write CSV
    fieldnames = _master_fieldnames()
    filename = f"consolidated_{date_lbl}.csv"
    with open(filename, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        w.writeheader()
        for r in rows:
            w.writerow(r)

    return filename, date_lbl, len(rows)


# ------------------ EMAIL ------------------
def _send_with_attachment(filename):
    with open(filename, "rb") as f:
        data = f.read()
    encoded = base64.b64encode(data).decode()

    msg = Mail(
        from_email=From(EMAIL_FROM, "Shreyas Ajgaonkar"),
        to_emails=EMAIL_TO,
        subject=f"Daily Consolidated CSV ({os.path.basename(filename)})",
        plain_text_content="Attached is today's consolidated CSV."
    )
    msg.attachment = Attachment(
        FileContent(encoded),
        FileName(os.path.basename(filename)),
        FileType("text/csv"),
        Disposition("attachment"),
    )
    sg = SendGridAPIClient(SENDGRID_API_KEY)
    sg.send(msg)


def _send_no_data(date_lbl):
    msg = Mail(
        from_email=From(EMAIL_FROM, "Shreyas Ajgaonkar"),
        to_emails=EMAIL_TO,
        subject=f"Daily Consolidated CSV – No Data ({date_lbl})",
        plain_text_content="No new data was found today."
    )
    sg = SendGridAPIClient(SENDGRID_API_KEY)
    sg.send(msg)


# ------------------ RUN ------------------
if __name__ == "__main__":
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]

    filename, date_lbl, n = export_today_csv(db)
    if n > 0 and filename:
        _send_with_attachment(filename)
        log(f"Exported {n} rows for {date_lbl} -> {filename}")
        log(f"Sent to: {', '.join(EMAIL_TO)}")
    else:
        _send_no_data(date_lbl)
        log(f"No data for {date_lbl}. Email sent to: {', '.join(EMAIL_TO)}")
