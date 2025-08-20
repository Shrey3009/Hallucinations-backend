// Use this script to import your patent data
// You can run this by calling POST /api/patents/bulk with this data

const patentData = [
  {
    categoryIndex: 1,
    category: "Smart Interactive Beverage & Food Containers",
    classifications: "A47G19/2227",
    patentName: "Wireless drink container for monitoring hydration",
    patentLink: "https://patents.google.com/patent/US20170340147A1",
    abstract:
      "A wireless drink container can monitor a person's hydration and prompt him or her to drink more if appropriate. The drink containers as described herein can monitor liquid levels and communicate with external devices about the liquid levels and rate of consumption. One or more sensors in the drink container monitor the liquid level within the container. A processor coupled to the sensor(s) estimates how much liquid has been removed from the container from changes in the liquid level and transmits a signal representing the change in liquid level to a smartphone or other external device. It also triggers an audio or visual indicator, such as an LED, that prompts the user to drink more based on the user's estimated liquid consumption and on the user's liquid consumption goals, which may be based on the user's physiology, activity level, and location.",
    status: "active",
    year: 2017,
    lowHallucinationExample:
      "A smart water bottle for athletes and fitness enthusiasts\n\nThis technology can be used to create a smart water bottle that helps athletes and fitness enthusiasts maintain optimal hydration during workouts. The bottle monitors how much water the user drinks, sends this data to a smartphone app, and provides reminders (via lights or sounds) when the user needs to drink more to meet their personalized hydration goals. The app can adjust these goals based on the user's body type, exercise intensity, and even environmental factors like temperature or altitude, helping users avoid dehydration and improve performance.",
    mediumHallucinationExample:
      "Smart Hydration Compliance for Elderly or At-Risk Patients in Assisted Living Facilities\n\nThis wireless drink container can be integrated into assisted living or healthcare environments to monitor and encourage hydration in elderly or medically at-risk patients. Many seniors and individuals with certain health conditions are prone to dehydration but may forget or neglect to drink regularly.\n\nWith the wireless hydration monitoring system, caregivers can receive real-time data on each resident's fluid intake via a centralized dashboard or app, enabling proactive intervention if someone's hydration falls below safe thresholds. The container's audio/visual reminders also prompt users directly, supporting independent living while ensuring health and safety. This application can help prevent dehydration-related complications, reduce hospitalizations, and improve overall wellness in these vulnerable populations.",
    highHallucinationExample:
      "Hydration monitoring for elderly care and remote health management\n\nThis wireless drink container could be used in elder care facilities or for individuals living independently who are at risk of dehydration. The smart container would monitor the user's drinking habits and automatically send real-time data to caregivers, family members, or healthcare providers via a connected app. If the system detects that the user is not drinking enough—based on personalized hydration goals that consider their age, health conditions, medications, and even the weather—it can trigger reminders on the bottle (lights or sounds) and send alerts to caregivers. This proactive approach helps prevent dehydration-related health issues, supports remote health monitoring, and gives peace of mind to families and medical professionals.",
  },
  {
    categoryIndex: 1,
    category: "Smart Interactive Beverage & Food Containers",
    classifications: "A47J41/005",
    patentName:
      "Container with heating/cooling assembly and removable power source modules",
    patentLink: "https://patents.google.com/patent/US11510528B2/en",
    abstract:
      "The embodiments disclose an attachable battery base module configured for powering at least one attachable application module coupled to the attachable battery base module, wherein the attachable battery base is configured for powering the at least one attachable application module, a heating module attachment with a temperature control module coupled to the attachable battery base module configured for heating and/or boiling a liquid, a cooling module attachment with the temperature control module coupled to the attachable battery base module configured for cooling a liquid and wherein the temperature control module includes a temperature maintenance mode, wherein the temperature maintenance mode is configured for maintaining a preset, predefined or user preselected desired temperature when the desired temperature is reached.",
    status: "active",
    year: 2017,
    lowHallucinationExample: "",
    mediumHallucinationExample: "",
    highHallucinationExample: "",
  },
  {
    categoryIndex: 1,
    category: "Smart Interactive Beverage & Food Containers",
    classifications: "F25B21/02",
    patentName: "Cooler for temperature sensitive items",
    patentLink:
      "https://patents.google.com/patent/US8887512B2/en?q=A47J41%2f005",
    abstract:
      'A carrier for thermally sensitive items such as medications, biological tissue and the like comprises a cooling chamber for receiving items to be cooled and a thermoelectric heat transfer module using the Peltier effect to cool the chamber. To maximize the time the cooling chamber remains in a cooled state when the heat transfer module is deenergized, a polymer gel is confined in conductive heat transfer relationship with the cooling chamber wall to provide a "volume of cold" surrounding the cooling chamber. The polymer gel releases thermal energy to the cooling chamber as the chamber is cooled to attain essentially the same temperature as the cooling chamber and absorbs thermal energy from the cooling chamber when the heat transfer module is deenergized and the cooling chamber begins to warm. Absent active cooling this release and absorption of thermal energy maximizes the duration of cold temperatures in the cooling chamber.',
    status: "active",
    year: 2012,
    lowHallucinationExample: "",
    mediumHallucinationExample: "",
    highHallucinationExample: "",
  },
  {
    categoryIndex: 2,
    category: "Healthcare",
    classifications: "A61B5/165",
    patentName:
      "Wearable device and method for stress detection, emotion recognition and emotion management",
    patentLink: "https://patents.google.com/patent/US20240090807A1/en",
    abstract:
      "A wearable device is configured to perform stress detection, emotion recognition and emotional management. The wearable device may perform a process that includes monitoring an emotional score of a user, the emotional score computed based on measured biological signals of the user. The device may detect an emotional event from the monitored emotional score. The device may transmit an alert signal to the user in response to the detected emotional event, in which an action plan associates the alert signal with a corresponding action to be performed by the user. The device may evaluate an effectiveness of the action plan by evaluating an impact of the action on the emotional score of the user. The device may determine a change to the action plan based on the evaluated effectiveness of the action plan. Finally, the device may incorporate the determined change into the action plan.",
    status: "pending",
    year: 2021,
    lowHallucinationExample:
      "A stress management wristband for workplace wellness\n\nThis technology can be used in a wearable wristband designed for employees in high-stress work environments. The device continuously monitors the user's biological signals (such as heart rate or skin conductance) to assess their emotional state and detect stress events. When elevated stress or negative emotions are detected, the wristband sends an alert to the user, prompting them to perform a recommended action (such as deep breathing or a short walk). The device then evaluates how effective the action was in reducing stress by monitoring changes in the user's emotional score, and it adapts future recommendations based on what works best for the individual. This helps employees manage stress in real time and supports overall workplace wellness.",
    mediumHallucinationExample:
      "Application: Real-Time Stress Management for Customer Service Representatives\n\nThis wearable device could be used by customer service representatives in call centers or retail environments to manage workplace stress and emotional well-being in real time. As employees interact with customers—often in high-pressure or emotionally charged situations—the device monitors their biological signals (such as heart rate variability, skin conductance, etc.) to assess stress or negative emotional states.\n\nWhen a spike in stress or a negative emotional event is detected, the device discreetly alerts the employee and suggests a personalized micro-intervention, such as a breathing exercise, a short walk, or a mental reset technique. The device then evaluates how effective the intervention was in lowering the stress level and automatically refines the suggested action plan for future events.\n\nManagers could receive anonymized, aggregate data to identify systemic stress triggers in workflows or customer interactions, leading to improvements in training, staffing, or workplace policies. This proactive approach helps prevent burnout, improves employee satisfaction, and enhances the quality of customer service.",
    highHallucinationExample:
      "Application: Emotion-Driven Interactive Storyteller for Children\n\nReimagine the wearable device as a magical story-companion bracelet for children, turning emotional management into a personalized adventure.\n\nConcept:\nThe wearable detects the child's stress, excitement, or mood changes throughout the day. When the device senses emotional spikes—such as anxiety, boredom, or excitement—it activates a corresponding \"chapter\" in an interactive audio or AR story delivered through a paired tablet or smart speaker.\n\nThe narrative adapts in real time based on the child's emotional state:\n\nIf the child is stressed, the story slows down and introduces calming characters or scenes.\nIf the child is anxious, a comforting hero or wise guide appears to lead breathing exercises within the story world.\nIf the child is bored or restless, the plot pivots into playful or challenging adventures.\nThe device evaluates the child's biological response during the story's interventions. If emotional state improves, the interactive plot continues in a positive direction; if not, the device subtly modifies the action plan, introducing different supportive elements in future chapters.\n\nFuturistic Twist:\nOver time, each child co-creates a unique, emotionally responsive fairytale, teaching lifelong emotional resilience through immersive, enchanting storytelling tailored to their own heart and mind.",
  },
  {
    categoryIndex: 2,
    category: "Healthcare",
    classifications: "G10L25/63",
    patentName: "Wearable emotion detection and feedback system",
    patentLink: "https://patents.google.com/patent/US9508008B2/en",
    abstract:
      "A see-through, head mounted display and sensing devices cooperating with the display detect audible and visual behaviors of a subject in a field of view of the device. A processing device communicating with display and the sensors monitors audible and visual behaviors of the subject by receiving data from the sensors. Emotional states are computed based on the behaviors and feedback provided to the wearer indicating computed emotional states of the subject. During interactions, the device, recognizes emotional states in subjects by comparing detected sensor input against a database of human/primate gestures/expressions, posture, and speech. Feedback is provided to the wearer after interpretation of the sensor input.",
    status: "active",
    year: 2015,
    lowHallucinationExample: "",
    mediumHallucinationExample: "",
    highHallucinationExample: "",
  },
  {
    categoryIndex: 2,
    category: "Healthcare",
    classifications: "A61B5/0205",
    patentName:
      "Wearable ecg and auscultation monitoring system with sos and remote monitoring",
    patentLink: "https://patents.google.com/patent/US20200337578A1/en",
    abstract:
      "Wearable ECG and auscultation monitoring system with SOS and remote monitoring. A wearable device for monitoring cardiac parameters of a user is provided. The device comprises a first electrode to measure electrical potential on a first portion of the user's body, a second electrode to measure electrical potential on a second portion of the user's body and a processor to measure the potential difference between the first electrode and the second electrode. It further comprises a sensor for capturing Seismocardiography, Phonocardiogramand Ballistocardiogram generated by the motion of the heart wall and the blood flow, display module for displaying the generated information, wireless communication modules for communicating and transferring the information generated by the device to a smart phone application of the user and to a remote data processing system.",
    status: "abandoned",
    year: 2019,
    lowHallucinationExample: "",
    mediumHallucinationExample: "",
    highHallucinationExample: "",
  },
  {
    categoryIndex: 3,
    category: "Automation",
    classifications: "B25J9/0003",
    patentName: "Companion robot for personal interaction",
    patentLink:
      "https://patents.google.com/patent/US10661433B2/en?q=G05D1%2f0251",
    abstract:
      "A mobile robot guest for interacting with a human resident performs a room-traversing search procedure prior to interacting with the resident, and may verbally query whether the resident being sought is present. Upon finding the resident, the mobile robot may facilitate a teleconferencing session with a remote third party, or interact with the resident in a number of ways. For example, the robot may carry on a dialogue with the resident, reinforce compliance with medication or other schedules, etc. In addition, the robot incorporates safety features for preventing collisions with the resident; and the robot may audibly announce and/or visibly indicate its presence in order to avoid becoming a dangerous obstacle. Furthermore, the mobile robot behaves in accordance with an integral privacy policy, such that any sensor recording or transmission must be approved by the resident.",
    status: "active",
    year: 2018,
    lowHallucinationExample: "",
    mediumHallucinationExample: "",
    highHallucinationExample: "",
  },
  {
    categoryIndex: 3,
    category: "Automation",
    classifications: "G05D1/0251",
    patentName: "Autonomous personal service robot",
    patentLink: "https://patents.google.com/patent/US8359122B2/en",
    abstract:
      "Autonomous personal service robot to monitor its owner for symptoms of distress and provide assistance. The system may include sensors to detect situations before they affect people such as smoke, heat, temperature and carbon monoxide sensors. The system can provide security for the home. The PRA may comprise features such as a medicine dispenser and blood pressure cuff. Features such as broadband internet, MP3 player, reading lights and eye glass tracker provide butler type capabilities that enable the system to appeal to markets beyond the elderly and infirmed. The system may also include an X10 transmitter/receiver to automatically control various household lights and appliances. Equipping the system with a robot arm enables the robot to fetch items, turn on and off wall switches and open the refrigerator.",
    status: "expired",
    year: 2007,
    lowHallucinationExample: "",
    mediumHallucinationExample: "",
    highHallucinationExample: "",
  },
  {
    categoryIndex: 3,
    category: "Automation",
    classifications: "B25J11/009",
    patentName: "Robot for medical assistance",
    patentLink: "https://patents.google.com/patent/US20150273697A1/en",
    abstract:
      "A robot for providing medical assistance, delivery medications and testing materials to a patient is disclosed. The robot includes a set of wheels and a mechanism for bringing the robot to a patient as well as a mechanism for avoiding objects and individuals. A computer and program provides initial guidance and instructions for medications and testing and medical history of a patient. The computer programs the robot to distribute medications, perform and record test results and in an emergency to telephone a healthcare provider. The robot also includes a transmitter and receiver for sending pictures, test results and medical history to a remote station. Further the robot includes a storage battery, a charger and means for connecting the charger to a source of electricity.",
    status: "abandoned",
    year: 2014,
    lowHallucinationExample: "",
    mediumHallucinationExample: "",
    highHallucinationExample: "",
  },
];

// To import this data, make a POST request to /api/patents/bulk with:
// { "patents": patentData }

module.exports = patentData;
