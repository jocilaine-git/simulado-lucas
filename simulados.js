// Banco de simulados — formato inspirado no teste do Prontos pro Mundo
// c = índice da alternativa correta (0 = primeira)
const SIMULADOS = [
{
  id: "S01", nivel: "A2", tema: "School life",
  reading: {
    textos: [
      { titulo: "Maria's School Day", texto: "Maria is fifteen years old and lives in Campinas. She gets up at six o'clock every morning because her school starts at seven. She usually has breakfast with her grandmother: bread, cheese and a glass of orange juice. Maria takes the bus to school, and the trip takes about twenty minutes. Her favourite subject is Biology, but she thinks Maths is difficult. After school, she has lunch at home and then she does her homework. On Tuesdays and Thursdays, she plays volleyball at a sports club near her house.",
        q: [
          { p: "What time does Maria's school start?", o: ["At six o'clock", "At seven o'clock", "At twenty past seven", "At eight o'clock"], c: 1 },
          { p: "Who does Maria usually have breakfast with?", o: ["Her mother", "Her friends", "Her grandmother", "Nobody"], c: 2 },
          { p: "What does Maria do on Tuesdays and Thursdays?", o: ["She studies Biology", "She plays volleyball", "She visits her grandmother", "She takes Maths classes"], c: 1 } ] },
      { titulo: "School Library – New Rules", texto: "From Monday, the library will open at 7:30 a.m. and close at 5 p.m. Students can borrow up to three books for two weeks. Please do not eat or drink inside the library. Mobile phones must be on silent. If you return a book late, you cannot borrow books for one week.",
        q: [
          { p: "How many books can a student borrow?", o: ["One", "Two", "Three", "Five"], c: 2 },
          { p: "What happens if you return a book late?", o: ["You pay a fine", "You can't borrow books for a week", "You must clean the library", "You lose your library card"], c: 1 },
          { p: "Which of these is NOT allowed in the library?", o: ["Reading magazines", "Using a phone on silent", "Eating a sandwich", "Borrowing books"], c: 2 } ] }
    ],
    lacunas: [
      { p: "My brother ___ football every weekend.", o: ["play", "plays", "playing", "is play"], c: 1 },
      { p: "We ___ to the beach last summer.", o: ["go", "goes", "went", "going"], c: 2 },
      { p: "There aren't ___ apples in the fridge.", o: ["some", "any", "much", "a"], c: 1 },
      { p: "She is ___ than her sister.", o: ["tall", "taller", "tallest", "more tall"], c: 1 }
    ]
  },
  listening: [
    { tipo: "Announcement", falas: [["A", "Attention, please. The train to Santos will leave from platform four, not platform two. The train is ten minutes late and will leave at nine fifteen. We are sorry for the delay."]],
      q: [
        { p: "Which platform will the train leave from?", o: ["Platform two", "Platform four", "Platform nine", "Platform ten"], c: 1 },
        { p: "What time will the train leave?", o: ["9:00", "9:10", "9:15", "9:50"], c: 2 } ] },
    { tipo: "Conversation", falas: [["A", "Hi Tom, are you coming to Julia's party on Saturday?"], ["B", "I'd love to, but I have a football match in the morning. What time does it start?"], ["A", "At four in the afternoon, at her house."], ["B", "Great, then I can go! Should I bring something?"], ["A", "Maybe some drinks. Julia is making a cake."]],
      q: [
        { p: "What does Tom have on Saturday morning?", o: ["A party", "A football match", "A test", "A trip"], c: 1 },
        { p: "What will Tom probably bring?", o: ["A cake", "Some drinks", "A present", "Pizza"], c: 1 } ] },
    { tipo: "Monologue", falas: [["B", "Hi, I'm Daniel. I live in a small town in the south of Brazil. In my free time I love playing the guitar. I started when I was ten, and now I play in a band with two friends. We practise every Friday in my garage. My dream is to study music in another country."]],
      q: [
        { p: "When did Daniel start playing the guitar?", o: ["When he was eight", "When he was ten", "When he was twelve", "When he was fifteen"], c: 1 },
        { p: "Where does the band practise?", o: ["At school", "In a studio", "In Daniel's garage", "At a friend's house"], c: 2 } ] }
  ],
  writing: { tema: "Write an email to a new friend from another country. Tell them about your family, your school and what you like to do in your free time.", min: 50 },
  speaking: {
    repetir: ["I go to school by bus.", "My favourite subject is English.", "We usually have lunch at half past twelve.", "Last weekend I watched a football match with my friends."],
    perguntas: [
      { p: "What do you usually do after school?", m: "After school, I usually have lunch at home, and then I do my homework. In the evening, I like to play video games or watch series with my brother." },
      { p: "Describe your best friend.", m: "My best friend is called Pedro. He is tall, funny and very friendly. We are in the same class, and we play football together every weekend." },
      { p: "What is your favourite food, and why?", m: "My favourite food is lasagna, because it is delicious and it reminds me of Sunday lunch with my family. My grandmother makes the best lasagna in the world." } ]
  }
},
{
  id: "S02", nivel: "A2", tema: "Food and weekends",
  reading: {
    textos: [
      { titulo: "A Special Market", texto: "Every Sunday morning, there is a big street market in Ana's neighbourhood. Ana goes there with her father to buy fruit and vegetables for the week. The market opens at six, but they usually arrive at eight because they like to sleep a little more. Ana's favourite part is the pastel stand. She always orders a cheese pastel and a sugarcane juice. Her father prefers to talk with the sellers, because many of them are his old friends. They go home before eleven, when the market starts to close.",
        q: [
          { p: "When do Ana and her father usually arrive at the market?", o: ["At six", "At eight", "At eleven", "At noon"], c: 1 },
          { p: "What does Ana always order?", o: ["A fruit salad", "A cheese pastel and a sugarcane juice", "Vegetables for the week", "A meat pastel and a coffee"], c: 1 },
          { p: "Why does her father like talking to the sellers?", o: ["He wants lower prices", "Many of them are his old friends", "He works at the market", "He is learning to cook"], c: 1 } ] },
      { titulo: "Easy Banana Smoothie", texto: "You need: 2 bananas, 1 cup of milk, 1 spoon of honey and some ice. 1. Cut the bananas into small pieces. 2. Put everything in a blender. 3. Blend for one minute. 4. Serve it cold. You can add oats if you want a healthier breakfast.",
        q: [
          { p: "How long do you blend the smoothie?", o: ["One minute", "Two minutes", "Five minutes", "Ten seconds"], c: 0 },
          { p: "Which ingredient is optional?", o: ["Milk", "Honey", "Oats", "Bananas"], c: 2 },
          { p: "What do you do first?", o: ["Add the ice", "Cut the bananas", "Turn on the blender", "Serve it cold"], c: 1 } ] }
    ],
    lacunas: [
      { p: "How ___ sugar do you want in your coffee?", o: ["many", "much", "more", "lot"], c: 1 },
      { p: "I ___ my homework yet.", o: ["didn't finish", "haven't finished", "don't finish", "am not finish"], c: 1 },
      { p: "They were watching TV ___ the phone rang.", o: ["while", "when", "during", "until"], c: 1 },
      { p: "Could you pass me ___ salt, please?", o: ["a", "an", "the", "some of"], c: 2 }
    ]
  },
  listening: [
    { tipo: "Voice message", falas: [["B", "Hi Mom, it's Laura. I'm still at the library, and I need to finish a project with my group. I'll be home at about seven thirty, not six. Can you save some dinner for me? Thanks, see you later!"]],
      q: [
        { p: "Where is Laura?", o: ["At school", "At the library", "At a friend's house", "At the gym"], c: 1 },
        { p: "What time will she get home?", o: ["6:00", "6:30", "7:00", "7:30"], c: 3 } ] },
    { tipo: "Conversation", falas: [["A", "Good evening. Are you ready to order?"], ["B", "Yes. I'd like the chicken with rice, please."], ["A", "I'm sorry, we don't have any chicken tonight. How about the fish?"], ["B", "Hmm, okay, the fish then. And a lemonade, please."]],
      q: [
        { p: "What does the customer order in the end?", o: ["Chicken", "Fish", "Pasta", "Salad"], c: 1 },
        { p: "What drink does the customer ask for?", o: ["Water", "Orange juice", "Lemonade", "Soda"], c: 2 } ] },
    { tipo: "Monologue", falas: [["A", "Every year, our school has a food festival. Each class prepares a dish from a different country. Last year my class made Japanese food. We made sushi, but it was really difficult! This year we want to make Mexican tacos, because they are easier and everybody loves them."]],
      q: [
        { p: "What did the class make last year?", o: ["Tacos", "Pizza", "Sushi", "Pasta"], c: 2 },
        { p: "Why do they want to make tacos this year?", o: ["The teacher chose them", "They are easier", "They are cheaper", "They are healthier"], c: 1 } ] }
  ],
  writing: { tema: "Describe your perfect weekend. Where would you go, who would you be with, and what would you eat?", min: 60 },
  speaking: {
    repetir: ["Can I have a glass of water, please?", "We eat rice and beans almost every day.", "My mother cooks dinner on weekdays.", "I don't like vegetables very much, but I eat them anyway."],
    perguntas: [
      { p: "What did you do last weekend?", m: "Last weekend I visited my grandparents. On Saturday we had a barbecue, and on Sunday I stayed at home, studied a little and watched a movie." },
      { p: "What is a typical meal in your house?", m: "A typical meal in my house is rice, beans, salad and some meat. Sometimes we have fried eggs or potatoes. On Sundays, we usually eat pasta." },
      { p: "Do you prefer cooking or eating out? Why?", m: "I prefer eating out, because I can try different kinds of food, like Japanese or Italian. But I want to learn to cook, because it is a useful skill." } ]
  }
},
{
  id: "S03", nivel: "A2", tema: "Technology",
  reading: {
    textos: [
      { titulo: "Too Much Screen Time?", texto: "A school in Ribeirão Preto did a survey with 300 students. The results showed that most teenagers spend more than five hours a day on their phones. Many students said they use their phones to chat with friends and watch videos, but only a few use them to study. The school decided to create a 'phone-free hour' every day after lunch. During this hour, students read books, play board games or talk to each other. After two months, teachers said that students were calmer and more focused in class.",
        q: [
          { p: "How many students answered the survey?", o: ["5", "100", "300", "500"], c: 2 },
          { p: "What do only a few students use their phones for?", o: ["Chatting with friends", "Watching videos", "Studying", "Playing games"], c: 2 },
          { p: "What happened after two months?", o: ["Students used their phones more", "Students were calmer and more focused", "The school stopped the project", "Teachers banned books"], c: 1 } ] },
      { titulo: "A Message", texto: "Hey Bia! Can you lend me your charger tomorrow? Mine broke this morning and my phone is almost dead. I'll give it back after class, I promise! Also, don't forget we have the History test on Friday, not Thursday. The teacher changed the date. — Leo",
        q: [
          { p: "Why does Leo need a charger?", o: ["He lost his", "His charger broke", "He wants a faster one", "His phone is new"], c: 1 },
          { p: "When is the History test?", o: ["Tomorrow", "On Wednesday", "On Thursday", "On Friday"], c: 3 },
          { p: "What will Leo do after class?", o: ["Buy a charger", "Give the charger back", "Study History", "Call Bia"], c: 1 } ] }
    ],
    lacunas: [
      { p: "I have ___ my phone at home!", o: ["forget", "forgot", "forgotten", "forgetting"], c: 2 },
      { p: "If it rains, we ___ at home.", o: ["stay", "will stay", "stayed", "would stay"], c: 1 },
      { p: "This is the ___ game I have ever played.", o: ["good", "better", "best", "most good"], c: 2 },
      { p: "He usually ___ his messages in the morning.", o: ["check", "checks", "checking", "is check"], c: 1 }
    ]
  },
  listening: [
    { tipo: "Announcement", falas: [["A", "Welcome to the City Museum. Today, the science area is closed for cleaning. The café on the second floor is open until five p.m. Please remember that photos are allowed, but you can't use a flash. Enjoy your visit!"]],
      q: [
        { p: "Which area is closed today?", o: ["The café", "The science area", "The second floor", "The art area"], c: 1 },
        { p: "What is NOT allowed?", o: ["Taking photos", "Using a flash", "Eating at the café", "Visiting the second floor"], c: 1 } ] },
    { tipo: "Conversation", falas: [["B", "Mum, can I buy a new phone? Mine is really slow."], ["A", "You got that phone only a year ago!"], ["B", "I know, but the battery doesn't last and the camera is bad."], ["A", "Okay, let's make a deal. If your grades improve this term, we'll talk about it."]],
      q: [
        { p: "What is the problem with the boy's phone?", o: ["It's broken", "It's slow and the battery doesn't last", "It's too big", "It's too expensive"], c: 1 },
        { p: "What does his mother say?", o: ["Yes, right now", "Never", "Maybe, if his grades improve", "Only on his birthday"], c: 2 } ] },
    { tipo: "Monologue", falas: [["B", "I'm Sofia, and I'm learning English with an app. I study for fifteen minutes every day, usually on the bus. The app is fun because it's like a game, and I get points for every lesson. But I also watch series in English with subtitles, because I want to understand real conversations."]],
      q: [
        { p: "When does Sofia usually study?", o: ["Before bed", "On the bus", "At lunch", "At school"], c: 1 },
        { p: "Why does she watch series in English?", o: ["To get points", "To understand real conversations", "Because her teacher asked", "To relax"], c: 1 } ] }
  ],
  writing: { tema: "Do you think teenagers use their phones too much? Give your opinion and two reasons.", min: 60 },
  speaking: {
    repetir: ["Could you send me the message again?", "My phone battery is almost dead.", "I usually listen to music on the way to school.", "I think social media can be useful and dangerous at the same time."],
    perguntas: [
      { p: "How do you use your phone on a typical day?", m: "I use my phone to talk to my friends, listen to music and watch videos. I also use it to study, for example to look up words in English." },
      { p: "Which app could you not live without? Why?", m: "I could not live without WhatsApp, because I use it to talk to my family and my friends every day. It is also where my class shares information about tests." },
      { p: "Describe a game you like to play.", m: "I really like playing football games on my console. I play online with my friends, and we talk while we play. It's exciting because every match is different." } ]
  }
},
{
  id: "S04", nivel: "A2+", tema: "Environment",
  reading: {
    textos: [
      { titulo: "The Plastic Problem", texto: "Every year, millions of tons of plastic end up in the oceans. Much of this plastic comes from things we use only once, like bags, straws and bottles. Sea animals, such as turtles and birds, often think the plastic is food and eat it. Some countries have already banned plastic bags in supermarkets. In Brazil, several cities have laws against plastic straws. Experts say that the best solution is to reduce the plastic we use, not only to recycle it, because recycling is expensive and only a small part of plastic is actually recycled.",
        q: [
          { p: "Why do sea animals eat plastic?", o: ["They are very hungry", "They think it is food", "People feed them", "It tastes good"], c: 1 },
          { p: "According to experts, what is the best solution?", o: ["Recycling more", "Using less plastic", "Cleaning beaches", "Banning fishing"], c: 1 },
          { p: "What does the text say about recycling?", o: ["It is cheap", "It solves the whole problem", "Only a small part of plastic is recycled", "It is not allowed in Brazil"], c: 2 } ] },
      { titulo: "Beach Clean-up Day!", texto: "Saturday, 12th October, 8 a.m. to 12 p.m. Meeting point: in front of the lifeguard tower. Bring a hat, sunscreen and a water bottle. We will provide gloves and bags. Volunteers under 16 must come with an adult. Free snacks for everyone!",
        q: [
          { p: "What will the organizers provide?", o: ["Hats", "Gloves and bags", "Water bottles", "Sunscreen"], c: 1 },
          { p: "Who needs to come with an adult?", o: ["Everyone", "People over 16", "Volunteers under 16", "Lifeguards"], c: 2 },
          { p: "How long is the event?", o: ["Two hours", "Three hours", "Four hours", "All day"], c: 2 } ] }
    ],
    lacunas: [
      { p: "Plastic bags ___ in many supermarkets now.", o: ["are banned", "banned", "ban", "are banning"], c: 0 },
      { p: "We should ___ water when we brush our teeth.", o: ["save", "saving", "to save", "saved"], c: 0 },
      { p: "I've lived here ___ 2019.", o: ["for", "since", "ago", "during"], c: 1 },
      { p: "The river is ___ dirty that nobody swims in it.", o: ["too", "so", "such", "very"], c: 1 }
    ]
  },
  listening: [
    { tipo: "Weather report", falas: [["A", "Good morning! Here's the weather for today. In São Paulo it will be cloudy in the morning, with rain in the afternoon. Temperatures will be between eighteen and twenty-four degrees. Tomorrow will be sunny and hotter, with a maximum of thirty degrees."]],
      q: [
        { p: "What will the weather be like this afternoon?", o: ["Sunny", "Rainy", "Windy", "Cold and dry"], c: 1 },
        { p: "What will the maximum temperature be tomorrow?", o: ["18 degrees", "24 degrees", "28 degrees", "30 degrees"], c: 3 } ] },
    { tipo: "Conversation", falas: [["A", "Did you see the news? Our city is going to plant ten thousand trees this year."], ["B", "That's great! Where are they going to plant them?"], ["A", "Mostly near schools and along the river."], ["B", "Can students help?"], ["A", "Yes, there's a volunteer program on weekends. I already signed up!"]],
      q: [
        { p: "How many trees will the city plant?", o: ["1,000", "10,000", "100,000", "One million"], c: 1 },
        { p: "When is the volunteer program?", o: ["On weekdays", "On weekends", "On holidays", "After school"], c: 1 } ] },
    { tipo: "Monologue", falas: [["B", "Hello, my name is Carla, and I'm a biologist. I work in a project that protects sea turtles on the coast of Bahia. Our team watches the beaches at night, when the turtles come to lay their eggs. When the baby turtles are born, we help them get to the sea safely. It's hard work, but it's the best job in the world."]],
      q: [
        { p: "When do the turtles come to lay their eggs?", o: ["In the morning", "At noon", "At night", "In the afternoon"], c: 2 },
        { p: "What does the team do for the baby turtles?", o: ["They feed them", "They take them to a zoo", "They help them reach the sea", "They count their eggs"], c: 2 } ] }
  ],
  writing: { tema: "What can students do to help the environment at school and at home? Give at least three ideas.", min: 70 },
  speaking: {
    repetir: ["Please put the bottles in the recycling bin.", "It rained a lot last night.", "We should turn off the lights when we leave the room.", "Many animals are in danger because their habitats are disappearing."],
    perguntas: [
      { p: "What do you do to help the environment?", m: "I try to save water and electricity. I take short showers and I turn off the lights when I leave a room. I also separate the trash for recycling at home." },
      { p: "Do you prefer the city or the countryside? Why?", m: "I prefer the countryside, because it is quiet and there is more nature. But the city is more practical, because there are more schools, shops and things to do." },
      { p: "Describe the weather where you live.", m: "Where I live, it is usually hot and sunny, especially in summer. In winter it gets a little cold at night, and from December to March it rains a lot in the afternoon." } ]
  }
},
{
  id: "S05", nivel: "B1", tema: "Travel and exchange",
  reading: {
    textos: [
      { titulo: "My First Week in Ireland", texto: "When I arrived in Dublin, I was nervous because my English wasn't perfect. My host family, the O'Briens, met me at the airport with a sign that said 'Welcome, Gabriel!'. The first days were difficult: people spoke very fast and I didn't understand their accent. Also, it was cold and it rained almost every day. But my host brother, Sean, helped me a lot. He introduced me to his friends and took me to a Gaelic football match. By the end of the week, I was understanding much more, and I was even starting to like the rain!",
        q: [
          { p: "How did Gabriel feel when he arrived?", o: ["Excited", "Nervous", "Angry", "Bored"], c: 1 },
          { p: "What was difficult in the first days?", o: ["The food", "Understanding people", "Finding the school", "The time difference"], c: 1 },
          { p: "How did Sean help Gabriel?", o: ["He taught him Irish", "He introduced him to his friends", "He cooked for him", "He gave him a coat"], c: 1 } ] },
      { titulo: "Exchange Orientation Meeting", texto: "Dear students, the exchange orientation meeting will be on Wednesday at 3 p.m. in the school auditorium. Parents or guardians must attend with the student. Please bring a copy of the student's passport and the signed authorization form. The meeting will take about two hours. Students who cannot come must contact the coordination office before Monday. Best regards, Ms. Fernandes, Coordinator.",
        q: [
          { p: "Who must go to the meeting with the student?", o: ["A teacher", "A friend", "A parent or guardian", "Nobody"], c: 2 },
          { p: "What should students bring?", o: ["A photo", "A passport copy and the signed form", "Some money", "Their report card"], c: 1 },
          { p: "What should a student do if they can't come?", o: ["Nothing", "Contact the office before Monday", "Send an email on Wednesday", "Bring the documents later"], c: 1 } ] }
    ],
    lacunas: [
      { p: "If I ___ more money, I would travel around the world.", o: ["have", "had", "will have", "would have"], c: 1 },
      { p: "She asked me where I ___ from.", o: ["am", "was", "were", "be"], c: 1 },
      { p: "I'm looking forward ___ you soon.", o: ["to see", "seeing", "to seeing", "see"], c: 2 },
      { p: "The flight was cancelled ___ the bad weather.", o: ["because", "because of", "so", "although"], c: 1 }
    ]
  },
  listening: [
    { tipo: "Airport announcement", falas: [["A", "Passengers on flight LA eight zero eight four to Toronto, please go to gate twenty-three. Boarding will start in fifteen minutes. Please have your passport and boarding pass ready. Passengers with small children may board first."]],
      q: [
        { p: "Where is the flight going?", o: ["Dublin", "Toronto", "Sydney", "Auckland"], c: 1 },
        { p: "Who can board first?", o: ["Business class passengers", "Passengers with small children", "Elderly passengers", "Students"], c: 1 } ] },
    { tipo: "Conversation", falas: [["B", "Excuse me, how do I get to the city library?"], ["A", "Go straight on this street for two blocks, then turn left at the bank. The library is opposite the park."], ["B", "Is it far? Can I walk?"], ["A", "Sure, it's about ten minutes on foot."]],
      q: [
        { p: "Where should he turn left?", o: ["At the park", "At the bank", "At the school", "At the library"], c: 1 },
        { p: "How long does it take to walk there?", o: ["5 minutes", "10 minutes", "15 minutes", "20 minutes"], c: 1 } ] },
    { tipo: "Monologue", falas: [["A", "Before you travel abroad, here are three tips. First, learn some basic phrases in the local language, like 'thank you' and 'excuse me'. Second, always keep a copy of your documents in your email. And third, be open-minded: things will be different from home, and that's the best part of the experience."]],
      q: [
        { p: "What is the second tip?", o: ["Learn basic phrases", "Keep a copy of your documents in your email", "Be open-minded", "Take a lot of money"], c: 1 },
        { p: "According to the speaker, what is the best part of the experience?", o: ["Shopping", "Things being different from home", "The food", "Making videos"], c: 1 } ] }
  ],
  writing: { tema: "Imagine you are going on an exchange program. Write a message to your host family introducing yourself and saying what you are excited and worried about.", min: 80 },
  speaking: {
    repetir: ["Excuse me, where is the bus station?", "I'm really excited about my trip to Canada.", "My host family lives in a small town near the coast.", "If I travel abroad, I want to learn as much as I can about the culture."],
    perguntas: [
      { p: "Why do you want to do an exchange program?", m: "I want to do an exchange program because I want to improve my English and learn about a different culture. I also think it will help me become more independent." },
      { p: "What would you tell people in another country about Brazil?", m: "I would tell them that Brazil is a huge country with beautiful beaches, forests and big cities. Brazilian people are friendly, and we love music, football and food, like feijoada and pão de queijo." },
      { p: "What would be the most difficult thing about living abroad?", m: "I think the most difficult thing would be missing my family and friends. The weather and the food could be difficult too, but I think I would get used to them." } ]
  }
},
{
  id: "S06", nivel: "B1", tema: "Sports and health",
  reading: {
    textos: [
      { titulo: "Sleep Like a Champion", texto: "Many athletes say that sleep is as important as training. Scientists agree: during sleep, our muscles recover and our brain organizes what we learned during the day. Teenagers need between eight and ten hours of sleep per night, but studies show that most of them sleep less than seven. One reason is that they use their phones late at night. The blue light from screens tells the brain that it is still day, which makes it harder to fall asleep. Experts recommend turning off screens at least one hour before bed.",
        q: [
          { p: "What happens to our muscles during sleep?", o: ["They get weaker", "They recover", "They stop working", "They get tired"], c: 1 },
          { p: "How many hours of sleep do teenagers need?", o: ["6 to 7", "7 to 8", "8 to 10", "10 to 12"], c: 2 },
          { p: "Why does blue light make sleeping harder?", o: ["It hurts the eyes", "It tells the brain it is still day", "It makes noise", "It heats the room"], c: 1 } ] },
      { titulo: "City Sports Centre", texto: "Free classes for teenagers (13–17). Swimming: Mondays and Wednesdays, 2–3 p.m. Basketball: Tuesdays and Thursdays, 4–5:30 p.m. Skateboarding: Saturdays, 9–11 a.m. Registration at the reception with ID and a recent photo. Places are limited!",
        q: [
          { p: "Which activity happens on Saturdays?", o: ["Swimming", "Basketball", "Skateboarding", "None"], c: 2 },
          { p: "What do you need to register?", o: ["Money and ID", "ID and a photo", "Only a photo", "A doctor's note"], c: 1 },
          { p: "How long is each basketball class?", o: ["One hour", "One hour and a half", "Two hours", "Three hours"], c: 1 } ] }
    ],
    lacunas: [
      { p: "I've been playing tennis ___ three years.", o: ["since", "for", "ago", "from"], c: 1 },
      { p: "You ___ drink water during exercise.", o: ["should", "would", "mustn't", "couldn't"], c: 0 },
      { p: "He's the player ___ scored the winning goal.", o: ["which", "who", "whose", "what"], c: 1 },
      { p: "I'm not used to ___ up early.", o: ["wake", "waking", "woke", "wakes"], c: 1 }
    ]
  },
  listening: [
    { tipo: "Coach's message", falas: [["A", "Okay, team, listen up. Tomorrow's game is at ten a.m., but I want everybody here at nine for the warm-up. Don't forget your blue shirts, not the white ones. And please, go to bed early tonight!"]],
      q: [
        { p: "What time should the players arrive?", o: ["At eight", "At nine", "At ten", "At eleven"], c: 1 },
        { p: "Which shirts should they wear?", o: ["White", "Blue", "Red", "Black"], c: 1 } ] },
    { tipo: "Conversation", falas: [["A", "You look tired. Are you okay?"], ["B", "I stayed up until two playing online with my friends."], ["A", "Again? You have a test today!"], ["B", "I know, I know. Tonight I'll leave my phone in the kitchen."]],
      q: [
        { p: "Why is the boy tired?", o: ["He studied late", "He played online until late", "He was sick", "He worked at night"], c: 1 },
        { p: "What does he plan to do tonight?", o: ["Buy a new phone", "Leave his phone in the kitchen", "Skip the test", "Sleep at school"], c: 1 } ] },
    { tipo: "Monologue", falas: [["B", "When I was fourteen, I started running because I wanted to lose weight. At first I could only run for five minutes. Now, three years later, I run ten kilometres three times a week, and last month I finished my first half marathon. Running changed my life: I feel happier and I sleep much better."]],
      q: [
        { p: "Why did she start running?", o: ["To win races", "To lose weight", "Because her friends ran", "Because her doctor told her to"], c: 1 },
        { p: "What did she do last month?", o: ["She started running", "She finished her first half marathon", "She hurt her leg", "She stopped running"], c: 1 } ] }
  ],
  writing: { tema: "Some people say that schools should have more physical education classes. Do you agree or disagree? Explain why.", min: 80 },
  speaking: {
    repetir: ["I play football with my friends on Saturdays.", "You should drink more water during the day.", "She has been training for the competition since January.", "Doing exercise regularly helps you feel better and sleep better."],
    perguntas: [
      { p: "What sports do you like to watch or play?", m: "I love playing football with my friends, and I also like watching volleyball on TV. Brazil has very good volleyball teams, so the matches are always exciting." },
      { p: "What do you do to stay healthy?", m: "I try to sleep well and eat healthy food, like fruit and vegetables. I also walk to school and play sports on the weekend. I need to drink more water, though." },
      { p: "Tell me about a time you were very tired. What happened?", m: "Once I stayed up very late studying for a Maths test. The next day I was so tired that I almost fell asleep in class. Since then, I try to study a little every day instead." } ]
  }
},
{
  id: "S07", nivel: "B1", tema: "Music and culture",
  reading: {
    textos: [
      { titulo: "The Power of Music", texto: "Researchers at a university in Canada studied how music affects teenagers' mood. They asked 200 students to listen to different kinds of music while doing homework. Students who listened to calm music without lyrics finished their tasks faster and made fewer mistakes. However, students who listened to songs with lyrics in their own language had more difficulty concentrating. Interestingly, many students said that music helped them feel less stressed, even when it didn't help them focus. The researchers suggest choosing instrumental music for studying and leaving favourite songs for breaks.",
        q: [
          { p: "Which students made fewer mistakes?", o: ["Those who listened to songs with lyrics", "Those who listened to calm music without lyrics", "Those who studied in silence", "Those who listened to loud music"], c: 1 },
          { p: "What did many students say about music?", o: ["It made them tired", "It made them feel less stressed", "It was boring", "It always helped them focus"], c: 1 },
          { p: "What do the researchers suggest?", o: ["Never listening to music", "Instrumental music for studying", "Only songs in English", "Studying with friends"], c: 1 } ] },
      { titulo: "Festival Review", texto: "I went to the winter festival last weekend and it was amazing! The concerts were great, especially the jazz band on Saturday night. The only problem was the food: it was expensive and the lines were really long. Next year I'll bring my own snacks. I give it 4 stars out of 5. — Marina, 17",
        q: [
          { p: "What did Marina like the most?", o: ["The food", "The jazz band", "The weather", "The lines"], c: 1 },
          { p: "What was the problem?", o: ["The concerts were bad", "The food was expensive and the lines were long", "It rained", "There were too few people"], c: 1 },
          { p: "What will she do next year?", o: ["She won't go", "She'll bring her own snacks", "She'll work at the festival", "She'll go on Friday"], c: 1 } ] }
    ],
    lacunas: [
      { p: "The concert was cancelled, ___ we stayed at home.", o: ["but", "so", "because", "although"], c: 1 },
      { p: "I wish I ___ play the guitar.", o: ["can", "could", "will", "am able"], c: 1 },
      { p: "This song ___ by millions of people.", o: ["has listened", "has been listened to", "listens", "is listening"], c: 1 },
      { p: "___ she was tired, she went to the party.", o: ["Despite", "Although", "However", "Because"], c: 1 }
    ]
  },
  listening: [
    { tipo: "Radio news", falas: [["A", "And now some news from the music world. The Brazilian singer Luana Reis has won an international award for her new album, which mixes samba with electronic music. She will start a world tour in March, with concerts in Lisbon, London and New York."]],
      q: [
        { p: "What did Luana Reis win?", o: ["A competition", "An international award", "A TV show", "A scholarship"], c: 1 },
        { p: "What styles does her album mix?", o: ["Rock and pop", "Samba and electronic music", "Jazz and funk", "Forró and rap"], c: 1 } ] },
    { tipo: "Conversation", falas: [["A", "Do you want to go to the cinema on Friday?"], ["B", "I can't on Friday, I have my English class. What about Saturday?"], ["A", "Saturday is fine. The comedy starts at seven and the action movie at nine."], ["B", "Let's see the comedy. Nine is too late for me."]],
      q: [
        { p: "Why can't the second speaker go on Friday?", o: ["He has to work", "He has an English class", "He has football practice", "He's visiting his grandparents"], c: 1 },
        { p: "Which film will they see?", o: ["The action movie at seven", "The comedy at seven", "The comedy at nine", "The action movie at nine"], c: 1 } ] },
    { tipo: "Monologue", falas: [["B", "In my opinion, learning a foreign language is like learning to play an instrument. You can't learn it only by reading about it; you have to practise every day, even for a short time. When I started learning English, I listened to songs and tried to sing along. It was a little embarrassing at first, but it helped my pronunciation a lot."]],
      q: [
        { p: "What does the speaker compare learning a language to?", o: ["Playing a sport", "Learning to play an instrument", "Cooking", "Driving"], c: 1 },
        { p: "How did singing help the speaker?", o: ["With vocabulary", "With pronunciation", "With grammar", "With writing"], c: 1 } ] }
  ],
  writing: { tema: "Write about a song, film or book that is important to you. What is it about, and why is it special for you?", min: 90 },
  speaking: {
    repetir: ["What kind of music do you usually listen to?", "I've never been to a big concert before.", "The film was so funny that we couldn't stop laughing.", "Although I don't speak English perfectly, I can understand most songs."],
    perguntas: [
      { p: "What kind of music do you like? Why?", m: "I like funk and pop music because they are fun to dance to. When I study, though, I prefer calm music without lyrics, because it helps me concentrate." },
      { p: "Describe a celebration or festival in your city.", m: "In my city, we celebrate Festa Junina in June. There are typical foods like corn cake and popcorn, people wear country clothes and dance the quadrilha. It's my favourite time of the year." },
      { p: "Do you prefer watching films at home or at the cinema? Why?", m: "I prefer watching films at the cinema because the screen is big and the sound is amazing. But at home it's cheaper and more comfortable, so I usually watch films at home with my family." } ]
  }
},
{
  id: "S08", nivel: "B1", tema: "Work and the future",
  reading: {
    textos: [
      { titulo: "Jobs of the Future", texto: "Experts believe that many of the jobs that today's teenagers will do don't exist yet. Technology is changing the world of work very quickly. For example, twenty years ago nobody worked as a social media manager or app developer. On the other hand, some jobs may disappear because machines and artificial intelligence can do them. Because of this, schools are trying to teach skills that machines don't have, such as creativity, teamwork and problem solving. Learning other languages is also important, since many companies work with people from different countries.",
        q: [
          { p: "What do experts believe?", o: ["All jobs will disappear", "Many future jobs don't exist yet", "Teenagers won't need to work", "Technology isn't changing work"], c: 1 },
          { p: "Which skill does the text say machines don't have?", o: ["Calculating", "Creativity", "Memory", "Speed"], c: 1 },
          { p: "Why is learning languages important?", o: ["Because exams require it", "Because companies work with people from different countries", "Because it is easy", "Because machines can't translate"], c: 1 } ] },
      { titulo: "Summer Internship", texto: "TechNova is looking for high school students (16+) interested in technology. 4 hours a day, Monday to Friday, during January. Basic English required. Paid internship + certificate. Send your CV and a short video (max. 1 minute) explaining why you want to join us by 15th December.",
        q: [
          { p: "What is the minimum age?", o: ["14", "15", "16", "18"], c: 2 },
          { p: "What must candidates send?", o: ["Only a CV", "A CV and a short video", "A letter from their school", "Their grades"], c: 1 },
          { p: "Which sentence is true?", o: ["The internship is not paid", "It is full-time", "It happens in January", "No English is needed"], c: 2 } ] }
    ],
    lacunas: [
      { p: "By the time I finish school, I ___ two languages.", o: ["learn", "will have learned", "have learned", "learned"], c: 1 },
      { p: "She suggested ___ for the job.", o: ["to apply", "applying", "apply", "applied"], c: 1 },
      { p: "The more you practise, the ___ you get.", o: ["good", "better", "best", "well"], c: 1 },
      { p: "I'd rather ___ in a team than alone.", o: ["work", "working", "to work", "worked"], c: 0 }
    ]
  },
  listening: [
    { tipo: "Interview", falas: [["B", "Hi, I'm Rafael, I'm twenty-four and I'm a game designer. When I was at school, I loved drawing and playing video games, but I didn't know these could become a job. I studied computer science, and now I create characters for mobile games. My advice? Find what you love and learn everything about it."]],
      q: [
        { p: "What does Rafael do?", o: ["He's a teacher", "He's a game designer", "He's a painter", "He works at a bank"], c: 1 },
        { p: "What did he study?", o: ["Art", "Computer science", "Design", "English"], c: 1 } ] },
    { tipo: "Job interview", falas: [["A", "So, why do you want to work in our café?"], ["B", "I like talking to people, and I want to earn some money for my exchange trip."], ["A", "Have you ever worked before?"], ["B", "Not officially, but I help at my aunt's shop every Saturday."]],
      q: [
        { p: "Why does the candidate want the job?", o: ["She loves coffee", "To earn money for her exchange trip", "Her parents told her to", "The café is near her house"], c: 1 },
        { p: "What experience does she have?", o: ["None at all", "She helps at her aunt's shop", "She worked at another café", "She was a waitress"], c: 1 } ] },
    { tipo: "Advice", falas: [["A", "Choosing a career can be stressful. My suggestion is to talk to people who already work in areas you find interesting. Ask them what a normal day is like, what they enjoy and what is difficult. Many students only think about salary, but it's also important to think about whether you will be happy doing that job every day."]],
      q: [
        { p: "What does the speaker suggest?", o: ["Choosing the job with the highest salary", "Talking to people who work in areas you like", "Asking your parents to choose", "Taking an online test"], c: 1 },
        { p: "Besides salary, what is important to consider?", o: ["The location", "Being happy doing the job every day", "The uniform", "Becoming famous"], c: 1 } ] }
  ],
  writing: { tema: "What would you like to do in the future (study, work, travel)? Explain your plans and what you are doing now to achieve them.", min: 90 },
  speaking: {
    repetir: ["I'd like to work with technology in the future.", "She has just started a new job at a hospital.", "If I had the chance, I would study engineering abroad.", "Learning English will open many doors for me in the future."],
    perguntas: [
      { p: "What job would you like to have in the future? Why?", m: "I would like to be an engineer because I like Maths and I enjoy understanding how things work. I think engineers can solve important problems and help their communities." },
      { p: "Would you prefer to work in a team or alone? Why?", m: "I would prefer to work in a team, because I can learn from other people and share ideas. Working alone can be faster, but I think teams find better solutions." },
      { p: "How can learning English help you in the future?", m: "English can help me get a better job, study in other countries and talk to people from all over the world. Also, most of the information on the internet is in English." } ]
  }
},
{
  id: "S09", nivel: "B1", tema: "City and community",
  reading: {
    textos: [
      { titulo: "A Library on Wheels", texto: "In a small town in Minas Gerais, a retired teacher named Dona Célia had an idea: she transformed an old bus into a mobile library. Every week, the bus visits neighbourhoods and rural areas where there are no libraries. Children can borrow books for free and join reading activities. At first, Dona Célia used her own books, but soon people from all over Brazil started sending donations. Today the bus has more than three thousand books, and the project has inspired similar initiatives in other states.",
        q: [
          { p: "What was Dona Célia's job?", o: ["Bus driver", "Librarian", "Teacher", "Writer"], c: 2 },
          { p: "Where does the bus go?", o: ["To big cities", "To areas with no libraries", "Only to schools", "To shopping centres"], c: 1 },
          { p: "How did the project grow?", o: ["With money from the government", "With donations from all over Brazil", "By selling books", "With help from her family"], c: 1 } ] },
      { titulo: "Neighbourhood Meeting", texto: "Topic: the new skate park. Date: Thursday, 7 p.m., at the community centre. The city hall wants to hear residents' opinions about the location and opening hours. Young people are especially welcome! Can't come? Send your suggestions to the residents' association by WhatsApp.",
        q: [
          { p: "What is the meeting about?", o: ["A new school", "The new skate park", "Parking problems", "A festival"], c: 1 },
          { p: "What does the city hall want?", o: ["Money", "Residents' opinions", "Volunteers to build it", "Skate teachers"], c: 1 },
          { p: "What can you do if you can't go?", o: ["Nothing", "Send suggestions by WhatsApp", "Go on Friday", "Call the city hall"], c: 1 } ] }
    ],
    lacunas: [
      { p: "The bus ___ we take to school is always late.", o: ["who", "which", "where", "whose"], c: 1 },
      { p: "I'm not sure if they ___ come tomorrow.", o: ["will", "would", "are", "did"], c: 0 },
      { p: "There ___ a lot of traffic this morning.", o: ["were", "was", "have", "are"], c: 1 },
      { p: "He told me that he ___ the film already.", o: ["has seen", "had seen", "sees", "was seeing"], c: 1 }
    ]
  },
  listening: [
    { tipo: "Public notice", falas: [["A", "Attention, residents! Because of repairs, there will be no water on Tuesday from eight a.m. to four p.m. in the Jardim América area. We recommend storing water the night before. We apologize for the inconvenience."]],
      q: [
        { p: "When will there be no water?", o: ["All day on Monday", "On Tuesday from 8 a.m. to 4 p.m.", "On Tuesday night", "On Wednesday morning"], c: 1 },
        { p: "What do they recommend?", o: ["Leaving the area", "Storing water the night before", "Calling the company", "Buying bottled water"], c: 1 } ] },
    { tipo: "Conversation", falas: [["A", "Have you seen the new bike lanes downtown?"], ["B", "Yes! Now I can ride my bike to school safely."], ["A", "My dad says they took space from the cars, and he's not happy."], ["B", "I understand, but fewer cars means less pollution."]],
      q: [
        { p: "How does the second speaker feel about the bike lanes?", o: ["Negative", "Positive", "She doesn't care", "Confused"], c: 1 },
        { p: "Why is the dad unhappy?", o: ["They were expensive", "They took space from the cars", "They are too narrow", "They are far from home"], c: 1 } ] },
    { tipo: "Monologue", falas: [["B", "Volunteering changed the way I see my city. Every Saturday I help at a community kitchen that serves lunch to around one hundred people. I used to think that problems like hunger were far away from me, but they're actually just a few streets from my house. Now I'm trying to convince my friends to join me."]],
      q: [
        { p: "How many people does the community kitchen serve?", o: ["About 10", "About 50", "About 100", "About 1,000"], c: 2 },
        { p: "What is she trying to do now?", o: ["Open a restaurant", "Convince her friends to join her", "Move to another city", "Get paid for her work"], c: 1 } ] }
  ],
  writing: { tema: "Write a letter to the mayor of your city suggesting one improvement for young people. Explain the problem and your solution.", min: 100 },
  speaking: {
    repetir: ["Could you tell me how to get to the city centre?", "There isn't a cinema in my neighbourhood.", "The streets are much safer since they installed new lights.", "I think every city should have more parks where young people can meet."],
    perguntas: [
      { p: "Describe your neighbourhood.", m: "My neighbourhood is quiet and residential. There is a small square with trees, a bakery and a supermarket near my house. Most people know each other, and on weekends children play in the street." },
      { p: "What would you change in your city?", m: "I would build more parks and sports centres for young people, because there are not many free places to have fun. I would also improve public transport, because the buses are often late and crowded." },
      { p: "Have you ever done volunteer work? Would you like to?", m: "I have never done volunteer work, but I would like to. I think I could help children with their homework or help at an animal shelter, because I love animals." } ]
  }
},
{
  id: "S10", nivel: "B1", tema: "Science and opinions",
  reading: {
    textos: [
      { titulo: "Can Animals Talk?", texto: "For a long time, people believed that only humans had language. However, scientists have discovered that many animals communicate in complex ways. Dolphins, for example, use special whistles that work like names. Bees dance to show other bees where to find flowers. Some monkeys have different alarm calls for different dangers: one for snakes, another for eagles. Although these systems are not as complex as human language, they show that communication is much more common in nature than we used to think. Now researchers are using artificial intelligence to try to understand whale songs.",
        q: [
          { p: "What do dolphins' whistles work like?", o: ["Songs", "Names", "Alarms", "Maps"], c: 1 },
          { p: "Why do bees dance?", o: ["To attract partners", "To show where flowers are", "To scare enemies", "To celebrate"], c: 1 },
          { p: "What are researchers doing now?", o: ["Teaching monkeys to speak", "Using AI to understand whale songs", "Recording bees", "Studying eagles"], c: 1 } ] },
      { titulo: "Two Weeks Without Social Media", texto: "Last month our class did an experiment: we stopped using social media for two weeks. The first three days were the hardest – I kept picking up my phone without thinking. But after that, I started reading more and talking more with my family. Not everyone finished the challenge: five of the thirty students gave up. Personally, I won't quit social media forever, but now I use it much less. — Júlia",
        q: [
          { p: "How long was the challenge?", o: ["Three days", "One week", "Two weeks", "One month"], c: 2 },
          { p: "How many students finished the challenge?", o: ["5", "25", "30", "3"], c: 1 },
          { p: "What did Júlia decide?", o: ["To quit social media forever", "To use social media much less", "To use social media more", "To get rid of her phone"], c: 1 } ] }
    ],
    lacunas: [
      { p: "Scientists ___ a new species of frog last year.", o: ["discover", "discovered", "have discovered", "discovering"], c: 1 },
      { p: "If people ___ more trees, the planet would be cooler.", o: ["plant", "planted", "will plant", "had plant"], c: 1 },
      { p: "It's important ___ both sides before you decide.", o: ["hear", "hearing", "to hear", "heard"], c: 2 },
      { p: "The experiment was ___ more difficult than we expected.", o: ["very", "much", "most", "many"], c: 1 }
    ]
  },
  listening: [
    { tipo: "Museum guide", falas: [["A", "This is the skeleton of a dinosaur found in the state of São Paulo in two thousand nineteen. It was about six metres long and ate only plants. Scientists believe it lived around eighty million years ago. Please don't touch the bones – they are very fragile."]],
      q: [
        { p: "When was the dinosaur found?", o: ["In 2009", "In 2019", "In 1999", "In 2021"], c: 1 },
        { p: "What did it eat?", o: ["Meat", "Fish", "Plants", "Insects"], c: 2 } ] },
    { tipo: "Discussion", falas: [["A", "Do you think robots will replace teachers one day?"], ["B", "I don't think so. Robots can explain things, but they can't really understand how students feel."], ["A", "But AI tutors are already helping a lot of students."], ["B", "True, but as a help, not as a replacement."]],
      q: [
        { p: "What is the second speaker's opinion?", o: ["Robots will replace teachers soon", "Robots won't replace teachers because they can't understand feelings", "Teachers are not necessary", "AI is dangerous for students"], c: 1 },
        { p: "How does the second speaker see AI tutors?", o: ["As a replacement for teachers", "As a help", "As a problem", "As a waste of time"], c: 1 } ] },
    { tipo: "Advice", falas: [["B", "When you read news online, ask yourself three questions. Who wrote it? Is there any evidence? And do other reliable websites say the same thing? Fake news spreads six times faster than true news, mostly because it makes people feel strong emotions like anger or fear. So, before you share something, take a breath and check."]],
      q: [
        { p: "How much faster does fake news spread, according to the speaker?", o: ["Two times", "Three times", "Six times", "Ten times"], c: 2 },
        { p: "Why does fake news spread so fast?", o: ["It is shorter", "It makes people feel strong emotions", "It is on TV", "It is funny"], c: 1 } ] }
  ],
  writing: { tema: "Some people think that artificial intelligence will make students lazy. Others think it can help them learn better. What is your opinion? Give examples.", min: 100 },
  speaking: {
    repetir: ["Scientists have discovered a new planet.", "I didn't believe the news until I checked it.", "Dolphins are among the most intelligent animals in the world.", "Before you share information online, you should make sure that it's true."],
    perguntas: [
      { p: "What subject do you find most interesting at school? Why?", m: "I find Biology the most interesting subject because I like learning about animals and the human body. Our teacher shows us experiments, and that makes the classes more fun." },
      { p: "Do you believe everything you read on the internet? Why or why not?", m: "No, I don't. There is a lot of fake news on the internet, so I try to check if other reliable websites say the same thing before I believe it or share it." },
      { p: "How do you think technology will change our lives in twenty years?", m: "I think technology will change our lives a lot. Maybe cars will drive themselves and robots will do housework. I hope technology also helps us solve problems like diseases and pollution." } ]
  }
}
];
