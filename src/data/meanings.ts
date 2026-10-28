// Hand-written meanings (பொழிப்புரை) for key verses, keyed by work id and verse position `n`.
// These are editorially curated. Meanings for the remaining verses are generated on demand by the
// LangGraph "explain" agent (see src/lib/agent/explain.ts) and are clearly labelled as AI drafts.

export interface Meaning {
  ta: string;
  en: string;
  note?: string;
}

export const CURATED_MEANINGS: Record<string, Record<number, Meaning>> = {
  thirumanthiram: {
    2: {
      ta: "இறைவன் ஒருவனே. அருளாகிய சக்தியுடன் அவன் இரண்டானான். படைத்தல், காத்தல், அழித்தல் எனும் மூன்றிலும் நிலைத்து நின்றான். நான்கு வேதங்களையும் உணர்ந்தான். ஐம்புலன்களையும் வென்றான். ஆறு ஆதாரங்களாக விரிந்தான். ஏழு உலகங்களையும் கடந்து மேலே சென்றான். எட்டு வடிவங்களாக (அட்டமூர்த்தமாக) எங்கும் உணர்ந்து நிலைபெற்றிருக்கிறான்.",
      en: "The Lord is One. With His gracious Shakti He became Two. He abides in the Three (creation, preservation, dissolution). He knew the Four (Vedas). He conquered the Five senses. He spread out as the Six (yogic centres). He rose beyond the Seven worlds, and remains, all-knowing, in the Eightfold form — earth, water, fire, air, space, sun, moon and the soul.",
      note: "Commentators read the numbers in several ways; this is the commonly given reading.",
    },
    6: {
      ta: "சிவனுக்கு நிகரான தெய்வத்தைத் தேடினாலும் கிடைக்காது; அவனுக்கு ஒப்பானவர் இங்கு யாரும் இல்லை. உலகங்களையெல்லாம் கடந்து நின்று, பொன்னொளி மின்னும் தவக்கனல் போன்ற சடைமுடியுடன், தாமரை போன்ற திருவுருவுடன் விளங்குபவன் அவன்.",
      en: "Search as you may, you will find no god equal to Shiva; there is no one here to compare with Him. Transcending all worlds He shines with golden radiance — the lotus-like Lord with blazing matted locks.",
    },
    52: {
      ta: "வேதத்தை விட்டு விலகிய அறம் இல்லை; ஓதத் தகுந்த அறங்கள் எல்லாம் வேதத்தில் உள்ளன. ஆகவே வீண் தர்க்க வாதங்களை விட்டு, அறிவுடையோர் வளமான வேதத்தை ஓதியே வீடுபேறு பெற்றனர்.",
      en: "There is no virtue apart from the Veda; every virtue worth learning is in it. So the wise gave up barren argument, recited the rich Veda and attained liberation.",
      note: "In Thirumanthiram 'Vedam' is read together with the Agamas as twin revelations.",
    },
    86: {
      ta: "நான் பெற்ற பேரின்பத்தை இந்த உலகமும் பெறட்டும். வானத்தையும் பற்றி நிற்கும் மறைபொருளான உண்மையைச் சொன்னால், உடலோடு பொருந்தி உணர்வாக நிற்கும் அந்த மந்திரம், பற்றப் பற்ற, தானே வந்து கைகூடும்.",
      en: "May the whole world attain the bliss that I have attained! When the hidden truth that holds even the heavens is spoken, the mantra that dwells in the body as awareness reveals itself more and more, the more firmly one holds to it.",
    },
    253: {
      ta: "இறைவனுக்கு ஒரு பச்சிலை இட்டு வணங்குதல், பசுவுக்கு ஒரு வாய் புல் கொடுத்தல், தான் உண்ணும்போது பிறருக்கு ஒரு கைப்பிடி உணவு அளித்தல், பிறரிடம் இனிய சொல் பேசுதல் — இவை எல்லோராலும் செய்யக்கூடிய எளிய அறங்கள்.",
      en: "Anyone can offer a green leaf to God; anyone can give a mouthful of grass to a cow; anyone can share a handful of food with another while eating; anyone can speak a kind word to others.",
    },
    271: {
      ta: "அன்பும் சிவமும் வேறுவேறு என்று அறிவில்லாதவர்கள் சொல்வார்கள். அன்பே சிவம் என்பதை யாரும் அறிவதில்லை. அன்பே சிவம் என்று அறிந்துகொண்டவர்கள், அன்பே சிவமாக அமைதியில் நிலைத்திருப்பார்கள்.",
      en: "The ignorant say that Love and Shiva are two. No one realises that Love itself is Shiva. Once one realises that Love is Shiva, one abides in peace as that Love which is Shiva.",
    },
    318: {
      ta: "மெய்யறிவைக் கல்லாத மூடர்களைக் காண்பதும் தகாது; அவர்கள் சொல்லைக் கேட்பதும் நம் கடமை அன்று. அத்தகைய மூடர்களைவிட, எழுத்தறிவில்லாத எளியவர்களே நல்லவர்கள்; அம்மூடர்கள் உண்மைப் பொருளின் கருத்தை ஒருபோதும் அறியமாட்டார்கள்.",
      en: "It is not good even to look upon fools who have not learnt true knowledge, nor is it our duty to listen to them. The simple unlettered are better than such fools, for those fools never grasp the meaning of truth.",
    },
    724: {
      ta: "உடல் அழிந்தால் அதனுள் இருக்கும் உயிரும் அழியும்; உறுதியான மெய்ஞ்ஞானத்தையும் அடைய முடியாது. ஆகவே உடலை வளர்க்கும் (காக்கும்) வழியை அறிந்து உடலை வளர்த்தேன்; அதனால் உயிரையும் வளர்த்தேன்.",
      en: "If the body perishes, the life within perishes too, and one cannot attain firm, true knowledge. So, learning the art of nurturing the body, I nurtured the body — and thereby nurtured the soul.",
      note: "A key verse for the Siddha view that the body is the instrument of liberation, not an obstacle.",
    },
    1554: {
      ta: "உள்ளமே பெரிய கோயில்; ஊனாலான இவ்வுடம்பே ஆலயம்; வள்ளலான இறைவனுக்கு வாயே கோபுர வாசல்; தெளிவடைந்தவர்களுக்கு உயிரே சிவலிங்கம்; வஞ்சிக்கும் ஐம்புலன்களும் (அடக்கப்பட்டால்) அணையாத மணிவிளக்குகள்.",
      en: "The heart is the great shrine; this body of flesh is the temple; for the bountiful Lord, the mouth is the tower-gate; to those who have clear vision, the soul is the Shiva-lingam; and the five deceiving senses, once mastered, are its ever-burning lamps.",
    },
    1588: {
      ta: "படங்கள் (சிற்பங்கள்) நிறைந்த கோயிலில் உள்ள இறைவனுக்கு ஒன்றைக் கொடுத்தால், அது நடமாடும் கோயிலான மனிதர்களுள் உறையும் இறைவனுக்குச் சேராது. ஆனால் நடமாடும் கோயிலான மனிதருக்கு ஒன்றைக் கொடுத்தால், அது படமாடக் கோயிலில் உள்ள இறைவனுக்கும் சேர்ந்துவிடும்.",
      en: "What you give to the Lord in the carved temple does not reach the Lord who dwells in the walking temple — the living human being. But what you give to the walking temple reaches the Lord of the carved temple as well.",
    },
    1834: {
      ta: "மனித குலம் ஒன்றே; தேவனும் ஒருவனே. நல்லதையே நினையுங்கள்; அப்போது எமனுக்கு அஞ்சி நாணவேண்டியதில்லை. வேறு எங்கும் சென்று புகலிடம் தேட வேண்டியதில்லை; உங்கள் சித்தத்திலேயே நிலைபெற்று நின்று, இறைவனை நினைத்து உய்யுங்கள்.",
      en: "Humankind is one family and God is one. Think only of the good, and you need not cower before death. There is no other refuge to run to; stand firm within your own mind, meditate on Him and be saved.",
    },
    1958: {
      ta: "ஒருவன் தனக்குத் தானே பகைவனும் நண்பனும் ஆவான்; இம்மையையும் மறுமையையும் தனக்குத் தானே அமைத்துக்கொள்கிறான்; தான் செய்த வினையின் பயனைத் தானே அனுபவிக்கிறான்; தனக்குத் தானே தலைவனும் ஆவான்.",
      en: "One is one's own enemy and one's own friend; one makes one's own this-world and next-world; one alone reaps the fruit of one's deeds; and one is one's own master.",
    },
    2020: {
      ta: "மரத்தால் செய்த யானைச் சிற்பத்தைப் பார்க்கும்போது, யானை என்ற தோற்றம் மரத்தை மறைக்கிறது; மரம் என்று உணரும்போது யானை மறைகிறது. அதுபோல, மண் முதலான பூதங்களாலான உலகமாகக் காணும்போது பரம்பொருள் மறைகிறது; பரம்பொருளை உணரும்போது பூதங்களாலான உலகத் தோற்றம் அதனுள் மறைந்துவிடுகிறது.",
      en: "In a wooden elephant, the elephant hides the wood; see the wood, and the elephant disappears. So too the world of earth and the other elements hides the Supreme; realise the Supreme, and the world of elements vanishes into it.",
    },
  },
  sivavakkiyam: {
    1: {
      ta: "ஆதியும் அந்தமுமாக விளங்கும் அரிய 'நமசிவாய' மந்திரம், தேவர்கள் அன்று போற்றி உரைத்த மந்திரம். அந்தச் சிறந்த எழுத்தை மனதில் எண்ணி, குற்றமும் தோஷமும் பாவமும் மாயையும் தொலைதூரம் ஓடிப்போகும்படி சிவவாக்கியத்தைச் சொல்லுவேன்.",
      en: "The precious 'Namasivaya', which is the beginning and the end, is the mantra the gods proclaimed of old. Meditating on that sacred syllable, I shall sing the Sivavakkiyam so that faults, afflictions, sin and illusion flee far, far away.",
    },
    4: {
      ta: "தமக்குள்ளேயே கலந்திருக்கும் சோதியான இறைவனை அறியாமல், வெளியே ஓடிஓடித் தேடி, நாடிநாடி நாட்களைக் கழித்து, வாடிவாடி மாண்டுபோன மனிதர்கள் கோடிகோடி — எண்ணிலடங்காதவர்கள்.",
      en: "Running and running, seeking and seeking the Light that is already mingled within them, wasting their days, withering and withering, people have died — crores upon crores, beyond all counting.",
    },
    7: {
      ta: "என்னுள்ளே இருந்த ஒன்றை (இறைவனை) நான் முன்பு அறியவில்லை. அதை அறிந்துகொண்ட பின்பு, என்னுள்ளே இருக்கும் அதனை வேறு யாரால் காண முடியும்? என்னுள்ளேயே இருந்து இருந்து நானே அதை உணர்ந்துகொண்டேன்.",
      en: "I never knew the One that was within me. Now that I have known it — who else can see that One within me? Abiding within, I came to realise it myself.",
    },
    14: {
      ta: "சாத்திரங்களை ஓதிக்கொண்டிருக்கும் சட்டநாதப் பட்டரே! உடல் வியர்த்து மூச்சு இரைக்கும் (மரண) நேரத்தில் வேதம் வந்து உதவுமோ? ஒரு கணப்பொழுதாவது உமக்குள்ளே இறைவனை அறிந்து ஒன்ற வல்லீரானால், சாத்திரப் பை சுமக்கும் நோய் ஏது? சக்தியும் முத்தியும் சித்தியும் தாமே கைகூடும்.",
      en: "O learned priest reciting your scriptures! When you sweat and gasp for breath at the end, will the Veda come to help you? If for even a moment you can know Him within and become one with Him, why suffer the disease of carrying a bag of scriptures? Power, liberation and perfection will be yours.",
    },
    21: {
      ta: "ஐந்து பூதங்களால் (அஞ்செழுத்தால்) பிறந்து, அதிலேயே வளர்ந்து, அஞ்செழுத்தை வாயால் ஓதிக்கொண்டிருக்கும் பஞ்சபூத உடல் கொண்டவர்களே! அந்த அஞ்செழுத்தில் உள்ள ஓர் எழுத்தின் உண்மையை அறிந்து சொல்ல வல்லீரானால், 'அஞ்சேல் அஞ்சேல்' என்று இறைவன் அம்பலத்தில் ஆடுவான்.",
      en: "Born of the five letters (the five elements), raised in them, you mechanically chant the five letters, you creatures of the five elements! If you can truly know and speak even one letter of those five, the Lord will dance in the Hall saying, 'Fear not, fear not!'",
    },
    35: {
      ta: "கோயில் என்பது எது? குளம் என்பது எது? கோயிலையும் குளத்தையும் கும்பிடும் அடிமைகளே! கோயிலும் மனத்துள்ளே, குளமும் மனத்துள்ளே! (அங்கு உணரப்படும் இறைவனுக்கு) ஆவதும் அழிவதும் இல்லை, இல்லை, இல்லவே இல்லை.",
      en: "What is a temple? What is a holy tank? You slaves who bow to temples and tanks! The temple is within the mind; the tank is within the mind! For That which is found there, there is no becoming and no perishing — none, none at all.",
    },
    37: {
      ta: "பூசை பூசை என்று பூசை செய்யும் பேதைகளே! நீங்கள் செய்யும் பூசையை உண்மையில் ஏற்றுக்கொண்டது எந்த இடம்? ஆதியான இறைவன் ஏற்றானா, அனாதியான பரம்பொருள் ஏற்றதா? எது பூசையை ஏற்றது என்று சொல்லுங்கள்!",
      en: "You fools who perform puja, crying 'puja, puja'! Where, in all your worship, is the one who receives it? Was it received by the First, or by the Beginningless? Tell me — what received your puja?",
    },
    40: {
      ta: "பறைச்சி என்பது யார்? (உயர்குலமாகக் கருதப்பட்ட) பணத்தி என்பது யார்? இறைச்சியிலும் தோலிலும் எலும்பிலும் சாதி அடையாளம் பொறிக்கப்பட்டு இருக்கிறதா? பறைச்சியுடன் வாழும் இன்பம் வேறா, பணத்தியுடன் வாழும் இன்பம் வேறா? உங்களுக்குள்ளேயே பகுத்துப் பாருங்கள்!",
      en: "What makes a woman a 'Paraichi' (of a caste called low) or a 'Panathi' (of a caste called high)? Is caste stamped on flesh, skin or bone? Is the joy of life with one different from the joy of life with the other? Examine it within yourselves!",
    },
    48: {
      ta: "கறந்த பால் மீண்டும் மடிக்குள் புகாது; கடைந்தெடுத்த வெண்ணெய் மோருக்குள் திரும்பாது; உடைந்த சங்கின் ஓசையும், உடலை விட்ட உயிரும் மீண்டும் புகா; விரிந்த பூவும் உதிர்ந்த காயும் மரத்துக்குத் திரும்பா. அதுபோல (மெய்யாக) இறந்தவர் மீண்டும் பிறப்பதில்லை, இல்லை, இல்லவே இல்லை.",
      en: "Milk once drawn does not return to the udder; churned butter does not go back into buttermilk; the sound of a broken conch and the life that has left the body do not return; the opened flower and the fallen fruit do not go back to the tree. So too, the dead are not born again — no, no, never.",
      note: "Often read as a denial of rebirth; many commentators read 'the dead' as those who have died to the ego — the liberated — who are never reborn.",
    },
    495: {
      ta: "நட்டுவைத்த கல்லைத் தெய்வம் என்று சொல்லி, நாலு பூக்களைச் சாத்தி, சுற்றிவந்து முணுமுணுத்துச் சொல்லும் மந்திரம் ஏதடா? இறைவன் உள்ளேயே இருக்கும்போது நட்டகல் பேசுமோ? சமைக்கும் சட்டியும் அகப்பையும் கறியின் சுவையை அறியுமோ?",
      en: "You plant a stone, call it god, put four flowers on it, walk round it muttering — what mantra is that? When the Lord dwells within you, will a planted stone speak? Does the cooking pot or the ladle know the taste of the curry?",
    },
  },
  thiruvekambamalai: {
    1: {
      ta: "அறம் செய்து இல்லறத்தில் வாழ்பவனைவிட, இல்லறத்தைத் துறந்தவன் கோடி மடங்கு உயர்ந்தவன்; அவனைவிட உள்ளத்தாலேயே துறவு பூண்டவன் நூறுகோடி மடங்கு உயர்ந்தவன்; அறிவோடு இருந்தும் இருவினை வாசனைகளும் அற்றுத் தன்னை மறந்து (அகந்தைக்கு) இறந்தவனின் பெருமையை என்னவென்று சொல்வேன், கச்சி ஏகம்பனே!",
      en: "Greater a crore times than one who lives virtuously as a householder is one who renounces the home; greater a hundred crore times than him is one who renounces in the heart; and one who, fully aware, has lost all traces of past deeds and died to the self — how can I describe his greatness, O Lord Ekambaa of Kanchi!",
    },
    2: {
      ta: "கட்டி அணைக்கும் மனைவியும் மக்களும், காலனாகிய தச்சன் மரத்தை வெட்டி முறிப்பதுபோல உடலை வீழ்த்திவிட்டால், பறை கொட்டி முழக்கி அழுவார்கள்; சுடுகாட்டை அடைந்தபின், அதற்கு அப்பால் ஓர் அடியாவது எடுத்து வைப்பார்களோ? இறைவா, கச்சி ஏகம்பனே!",
      en: "When Time the carpenter fells this body like a tree, the wife and children who embraced you will beat drums and wail; but once they reach the cremation ground, will they take even one step beyond it with you? O Lord Ekambaa of Kanchi!",
    },
  },
  "thiruppadal-thirattu": {
    29: {
      ta: "நெஞ்சே! வலிய தோள்களையுடைய அண்ணாமலையாரின் மலர்ப்பாதங்களை எப்போதும் நினைத்துப் போற்று. இந்த உலகில் நிலையான செல்வம் என்று ஓடியோடித் தேடிப் புதைத்து வைத்த பொருளால் என்ன பயன்? கடைசிப் பயணத்தில் காது அறுந்த ஒரு ஊசி கூட உன்னுடன் வராது.",
      en: "O heart, always praise the flower-feet of the strong-shouldered Lord of Annamalai. What use is the wealth you ran about to gather and bury, thinking it permanent? On the final road not even a needle with a broken eye will go with you.",
      note: "This line was the message Pattinathar found in the box left by his son Marudhavanan — the moment of his renunciation.",
    },
    32: {
      ta: "செல்வமும் வாழ்வும் வீட்டு வாசல் வரைதான்; கண்ணீர் சொரியும் மனைவியர் தெருமுனை வரைதான்; விம்மிவிம்மி இரு கைகளையும் தலைமேல் வைத்து அழும் மக்கள் சுடுகாடு வரைதான்; அதற்கும் அப்பால் பற்றித் தொடர்ந்து வருபவை நாம் செய்த புண்ணியமும் பாவமுமாகிய இருவினைகள் மட்டுமே.",
      en: "Wealth and status go only as far as the doorstep; the wife with streaming eyes, only as far as the street; the sons who sob with both hands upon their heads, only as far as the cremation ground. Beyond that, only the two kinds of deeds — merit and sin — cling to you and follow.",
    },
    87: {
      ta: "முன்பு (சிவன்) இட்ட தீ முப்புரத்தில் எரிந்தது; பின்பு (அனுமன்) இட்ட தீ தென் இலங்கையில் எரிந்தது; என் அன்னை (என்னைச் சுமந்து) இட்ட தீ அவள் அடிவயிற்றில் எரிந்தது; இப்போது நானும் இடும் இந்தத் தீ மூள்க, மூள்கவே!",
      en: "The fire set of old burned the Three Cities; the fire set later burned Lanka in the south; the fire my mother bore burned in her womb; now let the fire that I set blaze up, blaze up!",
      note: "Sung by Pattinathar as he lit his mother's funeral pyre.",
    },
  },
  "kachi-thiruvagaval": {
    17: {
      ta: "காட்டில் திரிந்தால் என்ன? காற்றை மட்டும் உண்டு வாழ்ந்தால் என்ன? கந்தை உடுத்தி ஓடு ஏந்தினால் என்ன? உள்ளத்தில் அன்பில்லாதவர்கள் உயர்ந்த விண்ணுலகை அடையார். இடைமருதூர் இறைவனிடம் மெய்யன்பு உள்ளவர்கள், மனைவியுடன் இல்லறத்தில் இருந்தாலும் மெய்ஞ்ஞான வீட்டின்பத்தை அடைவார்கள்.",
      en: "What if you wander the forests? What if you live on air alone? What if you wear rags and carry a begging bowl? Those without love in their hearts will not reach the high heaven. Those with true love for the Lord of Idaimarudur will attain the bliss of true wisdom even while living at home with their wives.",
    },
  },
  "meignana-pulambal": {
    1: {
      ta: "அகந்தையை அடக்கி, ஐம்புலன்களையும் சுட்டெரித்து, தூங்காமல் தூங்கி (விழிப்புடன் கூடிய யோக நித்திரையில் இருந்து) பேரின்பம் பெறுவது எக்காலம்?",
      en: "When will I subdue my ego, burn away the five senses, and sleep without sleeping — in wakeful yogic rest — to attain bliss?",
    },
    2: {
      ta: "நீங்காத சிவயோக நித்திரையில் இருந்தபடியே, வற்றாத கருணை வெள்ளத்தைத் தேக்கி வைத்து அனுபவிப்பது எக்காலம்?",
      en: "When will I rest in unbroken Shiva-yoga sleep and gather in the never-failing flood of grace?",
    },
    13: {
      ta: "தந்தை, தாய், மக்கள், உடன்பிறந்தோர் யாவரும் நிலையற்றவர் என்பதை மனதில் உணர்ந்து, அவர்கள் மீதான பற்று என்னும் முடிச்சை அறுப்பது எக்காலம்?",
      en: "When will I see in my heart that father, mother, children and siblings are all impermanent, and cut the knot of attachment?",
    },
    14: {
      ta: "நிலைபெற்ற உயிர்களைக் கொன்று வதைத்து உண்டு உழலாமல், அவற்றைத் தன் உயிர்போல் எண்ணித் தவத்தை முடிப்பது எக்காலம்?",
      en: "When will I stop killing and tormenting living beings to eat them, and complete my austerity seeing every life as my own?",
    },
  },
  "kaduveli-ananda-kalippu": {
    1: {
      ta: "மனமே, பாவம் செய்யாதிரு; நாளை எமன் சினத்துடன் வந்து உன்னைக் கொண்டுபோவான். பாவம் செய்யாதிரு மனமே! (சரணம்:) பிறருக்குச் சாபம் கொடுக்கலாமோ? விதியை நம்மால் தடுக்க முடியுமோ? கோபம் கொள்ளலாமோ? ஆசையில் மனதைச் செலுத்தலாமோ?",
      en: "Do no sin, O mind — tomorrow Yama will come in anger and carry you off. Do no sin, O mind! (Verse:) Should we curse others? Can we stop fate? Should we give way to anger? Should we hand our minds over to desire?",
    },
    2: {
      ta: "சூதும் பொய்யும் மோசமும் செய்தால், அது சுற்றத்தையே முற்றிலும் துடைத்தழிக்கும். நல்ல பக்தியும் நம்பிக்கையும் எந்நாளும் மனிதர்க்கு நன்மை தரும் நட்பாகும்.",
      en: "Gambling, lies and fraud bring a ruin that wipes out one's whole family. Sincere devotion and faith are a friend that does good to people every day.",
    },
    4: {
      ta: "நந்தவனத்தில் ஓர் ஆண்டி இருந்தான்; அவன் நாலாறு (பத்து) மாதங்கள் குயவனை வேண்டி ஒரு தோண்டியை (மண்பானையை) வாங்கி வந்தான்; வந்ததும் கூத்தாடிக் கூத்தாடி அதைப் போட்டு உடைத்துவிட்டான்.",
      en: "In a flower garden there was an Aandi (mendicant). For four-and-six (ten) months he begged the potter and brought home a water-pot; then, dancing and dancing about, he dropped it and smashed it.",
      note: "Inner meaning: the Aandi is the soul, the garden this world, the potter God, the ten months the time in the womb, and the pot the human body — wasted in careless revelry.",
    },
  },
  "kudhambai-padalgal": {
    1: {
      ta: "வெட்டவெளியான பரம்பொருளையே உண்மை என்று உணர்ந்து இருப்போருக்கு, உரிமையும் பதவியும் தரும் பட்டயம் எதற்கடி, குதம்பாய்?",
      en: "For those who know the open void — the Supreme — as the only truth, what need is there of title-deeds and honours, Kudhambai?",
    },
    28: {
      ta: "மாங்காய்ப்பால் (யோக நெறியில் உள்ளே ஊறும் அமுதம்) உண்டு மலைமேல் (சிரசின் உச்சியில்) இருக்கும் யோகிகளுக்கு, தேங்காய்ப்பால் (உலக இன்பச் சுவை) எதற்கடி குதம்பாய்?",
      en: "For those who drink the 'mango-milk' (the inner nectar of yoga) and dwell upon the 'mountain' (the crown of the head), what need is there of 'coconut-milk' (worldly delights), Kudhambai?",
      note: "The images are symbolic; commentators interpret them in slightly different yogic terms.",
    },
  },
  "pambatti-padal": {
    1: {
      ta: "தெளிந்து தெளிந்து ஆடு பாம்பே — சிவனின் சிறப்பான திருவடிகளைக் கண்டு தெளிந்து ஆடு பாம்பே! ஆடும் பாம்பே, தெளிவுடன் ஆடு; சிவனின் திருவடிகளைக் கண்டோம் என்று ஆடு பாம்பே!",
      en: "Dance with clarity, O snake — having seen the glorious feet of Shiva, dance with clarity! Dancing snake, dance clear-sighted; dance, O snake, for we have seen the feet of Shiva!",
      note: "The 'snake' is the kundalini — the coiled spiritual energy that the Siddhar awakens.",
    },
    65: {
      ta: "நாற்றமுள்ள மீனை நல்ல தண்ணீரில் நாள்தோறும் பலமுறை கழுவினாலும் அதன் நாற்றம் போகுமோ? அதுபோல, பல நதிகளில் நீராடினாலும் உள்ளே கொண்ட மலம் நீங்காது என்று ஆடு பாம்பே!",
      en: "Wash a stinking fish in clean water many times a day — will its stench go? Just so, bathing in many holy rivers will not remove the impurity within. Dance, O snake!",
    },
  },
  "agappei-padalgal": {
    1: {
      ta: "அகப்பேயே (அலையும் மனமே)! இறைவனின் திருவடியைப் பெற நஞ்சுண்பது போன்ற கடுந்துன்பம் தேவையில்லை. நெஞ்சே, கலங்காதே; நீ ஒன்றும் பேசாதே — மௌனமாயிரு.",
      en: "O demon-mind (Agappei)! You need not swallow poison — no harsh torment is needed — to reach the Lord's feet. O heart, do not waver; say nothing at all — be still.",
    },
    41: {
      ta: "சைவம் (அன்பு) என்பது தானாகவே இயல்பாக நிற்பது, அகப்பேயே; அந்தச் சைவம் (அன்பு) இல்லாவிட்டால் கலக்கமும் வஞ்சனையும் வந்து சேரும் என்று கண்டுகொள்.",
      en: "'Saivam' — love — stands on its own as one's true nature, O Agappei; and know that without that love, turmoil and deceit set in.",
      note: "Project Madurai's introduction notes that in Agappei's songs 'Saivam' means love.",
    },
  },
  "azhukani-padalgal": {
    1: {
      ta: "மூலாதாரம் என்னும் பதியில், ஆறு ஆதாரங்கள் கொண்ட இவ்வுடல் வீட்டில், குழப்பமான தெருவின் நடுவே அழகான பதியில், அனலாக வளர்த்த கம்பம் (சுழுமுனை) உயர்ந்து நிற்கும் மேல் பதியில் நிகழும் விளையாட்டை, என் கண்ணம்மா, பார்க்கமாட்டேனோ!",
      en: "In the root-abode, in this house of six centres, in the lovely dwelling amid the twisting street, where a pillar raised like fire (the sushumna) rises to the upper abode — shall I not see the play there, my Kannamma!",
      note: "A yogic allegory of the body's subtle centres; readings vary in detail.",
    },
    2: {
      ta: "எட்டுச் சாண் உடம்பு; அதற்கு ஒன்பது வாசல்கள்; ஐம்புலன்கள் என்னும் ஐந்து பஞ்சாயத்துக்காரர்கள்; இரண்டு பட்டணங்கள் (இரு நாடிகள்). (மனமே) நீ அஞ்சாமல் பேசுகிறாய்; ஆனால் எமனின் ஆணைக்கு அஞ்சி, நெஞ்சு உறுதியாக நிற்காமல், என் கண்ணம்மா, நிலைகெட்டு வாடுகிறேனடி!",
      en: "A body eight spans long with nine gates; five council-men, the senses; two cities, the two channels of breath. You talk without fear — yet, afraid of Death's command, my heart will not stand firm, my Kannamma, and I wilt, shaken from my place!",
    },
  },
  "agathiyar-gnanam": {
    1: {
      ta: "சக்தியே பராபரம்; தெய்வம் ஒன்றே; எல்லா உயிர்களுக்கும் அதுவே உயிராக உள்ளது. அறிவால் இதை உணர்ந்த புண்ணியர் உலகில் கோடியில் ஒருவர். பக்தியால் மனம் அடங்கி நிலையில் நிற்பவரே பரமஞானி; அவர் மனத்தைப் பாழில் விடமாட்டார்; புனிதம் தேடி அலையவும் மாட்டார். இதுவே சூட்சுமம்: சுழிமுனையில் நிலையறிந்தால் மோட்சம் தானே கிடைக்கும்.",
      en: "Shakti is the Supreme; God is one, and is the life of every living being. Those blessed ones who know this by insight are one in a crore. The true sage, his mind stilled by devotion, stands firm; he never lets the mind run to waste, nor wanders about seeking purity. This is the secret: know the still point in the sushumna and liberation comes of itself.",
    },
  },
  "idaikkadar-padalgal": {
    25: {
      ta: "'தாந் திமிதிமி' என்று ஆனந்தக் கூத்தாடும் கோனாரே! அருள் தரும் ஆனந்தக் கோனாரே! ஆயிரத்தெட்டு வட்டங்களையும் கண்டேன்; அந்த வட்டத்தின் உள்ளே நின்றவனையும் கண்டேன்; பெரிய இவ்வுலகின் நூற்றெட்டையும் பார்த்தேன்; மந்தமான மனத்தில் இருந்த சந்தேகம் தீர்ந்தேன்.",
      en: "'Thaan thimithimi!' — O blissful Herdsman, dancing! O Herdsman of grace and joy! I have seen the thousand-and-eight circles, and seen the One who stands within them; I have looked upon the hundred-and-eight of this vast world; and the doubt that clouded my dull mind is gone.",
      note: "The 'Konar' (herdsman) is both the shepherd-singer's companion and the Lord who tends all souls.",
    },
  },
  "gnana-kummi": {
    1: {
      ta: "மேன்மை பொருந்திய ஞான வடிவான பரதேசிகனாகிய சற்குருவின் அருளால், இவ்வுலகில் ஞானக்கும்மியைப் பாட, சிவபாலனாகிய கணபதி காப்பாக இருப்பார்.",
      en: "By the grace of the true Guru, the Supreme Teacher whose very form is glorious wisdom, may Ganapati, the son of Shiva, protect me as I sing this Gnana Kummi in the world.",
    },
  },
  "konganar-padalgal": {
    2: {
      ta: "சக்தியும், சடைமுடி தரித்தவளும், வாலைப் பெண்ணுமான அந்த உத்தமியின் மேல் கும்மிப் பாட்டு உரைக்க, அறிவுக்கு உதவும் ஒற்றைக் கொம்பனாகிய சித்தி விநாயகன் காப்பாவான்.",
      en: "To sing this kummi to that noble one — Shakti, the matted-haired goddess, the maiden Vaalai — may Siddhi Vinayaka, the single-tusked helper of learning, be my protection.",
    },
  },
};

export function getCuratedMeaning(workId: string, n: number): Meaning | undefined {
  return CURATED_MEANINGS[workId]?.[n];
}

export const CURATED_COUNT = Object.values(CURATED_MEANINGS).reduce((a, w) => a + Object.keys(w).length, 0);
