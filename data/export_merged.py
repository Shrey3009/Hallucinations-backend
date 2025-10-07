import os, csv
from collections import defaultdict
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

DB_NAME = "test"

def oid(v):
    return str(v) if isinstance(v, ObjectId) else v

def main():
    uri = os.environ["MONGO_URI"]
    cx = MongoClient(uri)
    db = cx[DB_NAME]

    # ----- Patent lookup -----
    patents = {}
    for p in db.patents.find():
        patents[str(p["_id"])] = {
            "name": p.get("patentName", ""),
            "category": p.get("category", "")
        }

    # ----- Index collections -----
    selections = {str(d["preSurveyId"]): d for d in db.patentselections.find()}
    posts = {str(d["preSurveyId"]): d for d in db.postsurveys.find()}
    aut_baseline = defaultdict(list)
    for d in db.auts.find():
        aut_baseline[str(d["preSurveyId"])].append(d)
    aut_gpt = defaultdict(list)
    for d in db.aut_gpts.find():
        aut_gpt[str(d["preSurveyId"])].append(d)
    chats = defaultdict(list)
    for d in db.chatmessages.find():
        chats[str(d["preSurveyId"])].append(d)

    # ----- Rows -----
    rows = []

    for pre in db.presurveys.find():
        pid = str(pre["_id"])
        row = {"preSurveyId": pid, "presurveyDate": str(pre.get("createdAt", ""))}

        # ---- PreSurvey details ----
        row.update({
            "age": pre.get("age", ""),
            "gender": pre.get("gender", ""),
            "race": pre.get("race", ""),
            "experience": pre.get("experience", ""),
            "designExperience": pre.get("designExperience", ""),
            "healthcareFamiliarity": pre.get("healthcareFamiliarity", ""),
            "automationFamiliarity": pre.get("automationFamiliarity", ""),
            "smartDevicesFamiliarity": pre.get("smartDevicesFamiliarity", "")
        })

        sel = selections.get(pid, {})

        # ---- Task 1 (Baseline) ----
        pat1 = patents.get(str(sel.get("task1Patent")), {})
        row["task1PatentCategory"] = pat1.get("category", "")
        row["task1PatentName"] = pat1.get("name", "")
        # Only Round1 ideas, cap at 3
        baseline_entries = aut_baseline.get(pid, [])
        if baseline_entries:
            for j, uc in enumerate(baseline_entries[0].get("useCases", []), start=1):
                if j > 3: break
                row[f"task1IdeasRound1.use{j}"] = uc.get("use", "")
                row[f"task1IdeasRound1.explanation{j}"] = uc.get("explanation", "")

        # ---- Tasks 2–4 (GPT) ----
        for t in (2, 3, 4):
            pat = patents.get(str(sel.get(f"task{t}Patent")), {})
            row[f"task{t}PatentCategory"] = pat.get("category", "")
            row[f"task{t}PatentName"] = pat.get("name", "")
            row[f"task{t}Level"] = sel.get(f"task{t}Level", "")

            # Chats: split User vs GPT
            user_msgs, gpt_msgs = [], []
            for doc in chats.get(pid, []):
                if doc.get("task") == t:
                    for m in doc.get("chatMessages", []):
                        if m.get("sender") == "user" or m.get("direction") == "outgoing":
                            user_msgs.append(m.get("message", ""))
                        else:
                            gpt_msgs.append(m.get("message", ""))

            row[f"task{t}UserChatCount"] = len(user_msgs)
            row[f"task{t}UserChatMessages"] = " | ".join(user_msgs)
            row[f"task{t}GPTChatCount"] = len(gpt_msgs)
            row[f"task{t}GPTChatMessages"] = " | ".join(gpt_msgs)

            # GPT Ideas by round (safe + cap 3 per round)
            task_gpt_entries = [d for d in aut_gpt.get(pid, []) if d.get("task") == t]
            for d in task_gpt_entries:
                rnd = d.get("round")
                if not rnd:
                    continue
                for j, uc in enumerate(d.get("useCases", []), start=1):
                    if j > 3: break
                    row[f"task{t}IdeasRound{rnd}.use{j}"] = uc.get("use", "")
                    row[f"task{t}IdeasRound{rnd}.explanation{j}"] = uc.get("explanation", "")

        # ---- PostSurvey ----
        post = posts.get(pid, {})
        row.update({
            "accuracy": post.get("accuracy", ""),
            "helpfulness": post.get("helpfulness", ""),
            "inspiration": post.get("inspiration", ""),
            "expansion": post.get("expansion", ""),
            "recombination": post.get("recombination", ""),
            "problems": post.get("problems", ""),
            "improvements": post.get("improvements", "")
        })

        rows.append(row)

    # ----- Ordered Fieldnames -----
    fieldnames = [
        "preSurveyId", "presurveyDate",
        "age","gender","race","experience","designExperience",
        "healthcareFamiliarity","automationFamiliarity","smartDevicesFamiliarity",
        # Task 1
        "task1PatentCategory","task1PatentName",
        "task1IdeasRound1.use1","task1IdeasRound1.explanation1",
        "task1IdeasRound1.use2","task1IdeasRound1.explanation2",
        "task1IdeasRound1.use3","task1IdeasRound1.explanation3"
    ]

    # Tasks 2–4
    for t in (2, 3, 4):
        fieldnames.extend([
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

    fieldnames.extend([
        "accuracy","helpfulness","inspiration","expansion","recombination","problems","improvements"
    ])

    # ----- Write CSV -----
    with open("consolidated.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        w.writeheader()
        for r in rows:
            w.writerow(r)

if __name__ == "__main__":
    main()
