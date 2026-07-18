// Program data shared by the app (Directory.jsx) and the build-time
// prerender script (scripts/prerender.mjs). Plain JS — no JSX — so Node
// can import it directly at build time.

// ── RESIDENCY PROGRAMS DATA ──────────────────────────────────────────────────
export const RESIDENCY_PROGRAMS = [
  // ALABAMA
  {id:1,institution:"University of Alabama at Birmingham",program:"UAB Anesthesiology",city:"Birmingham",state:"AL",director:"Doris Cope, MD",email:"anesthesia@uabmc.edu",website:"https://www.uab.edu/medicine/anesthesiology",size:"Large Academic"},
  {id:2,institution:"University of South Alabama",program:"USA Health Anesthesiology",city:"Mobile",state:"AL",director:"Program Director",email:"",website:"https://www.southalabama.edu/colleges/com/anesthesiology",size:"Community"},
  // ARIZONA
  {id:3,institution:"University of Arizona",program:"UA Anesthesiology",city:"Tucson",state:"AZ",director:"Kevin Tremper, MD",email:"",website:"https://anesthesiology.arizona.edu",size:"Large Academic"},
  {id:4,institution:"Mayo Clinic Arizona",program:"Mayo Clinic Anesthesiology (AZ)",city:"Scottsdale",state:"AZ",director:"Program Director",email:"",website:"https://www.mayo.edu/research/departments-divisions/department-anesthesiology-perioperative-medicine",size:"Large Academic"},
  {id:5,institution:"Valleywise Health",program:"Valleywise Anesthesiology",city:"Phoenix",state:"AZ",director:"Program Director",email:"",website:"",size:"Community"},
  // ARKANSAS
  {id:6,institution:"University of Arkansas for Medical Sciences",program:"UAMS Anesthesiology",city:"Little Rock",state:"AR",director:"Program Director",email:"anesthesiology@uams.edu",website:"https://medicine.uams.edu/anesthesiology",size:"Academic"},
  // CALIFORNIA
  {id:7,institution:"UCLA",program:"UCLA Anesthesiology",city:"Los Angeles",state:"CA",director:"Maxime Cannesson, MD",email:"anesthresidency@mednet.ucla.edu",website:"https://www.uclahealth.org/anesthesiology",size:"Large Academic"},
  {id:8,institution:"UCSF",program:"UCSF Anesthesia",city:"San Francisco",state:"CA",director:"Program Director",email:"anesthresidency@ucsf.edu",website:"https://anesthesia.ucsf.edu",size:"Large Academic"},
  {id:9,institution:"Stanford University",program:"Stanford Anesthesiology",city:"Stanford",state:"CA",director:"Program Director",email:"anes-residency@stanford.edu",website:"https://med.stanford.edu/anesthesia.html",size:"Large Academic"},
  {id:10,institution:"UC San Diego",program:"UCSD Anesthesiology",city:"San Diego",state:"CA",director:"Program Director",email:"",website:"https://anesthesia.ucsd.edu",size:"Large Academic"},
  {id:11,institution:"UC Davis",program:"UC Davis Anesthesiology",city:"Sacramento",state:"CA",director:"Program Director",email:"",website:"https://health.ucdavis.edu/anesthesiology",size:"Academic"},
  {id:12,institution:"Cedars-Sinai Medical Center",program:"Cedars-Sinai Anesthesiology",city:"Los Angeles",state:"CA",director:"Program Director",email:"",website:"https://www.cedars-sinai.org/education/graduate-medical-education/residency-fellowship/anesthesiology.html",size:"Large Academic"},
  {id:13,institution:"Loma Linda University",program:"Loma Linda Anesthesiology",city:"Loma Linda",state:"CA",director:"Program Director",email:"",website:"https://medicine.llu.edu/academics/departments/anesthesiology",size:"Academic"},
  {id:14,institution:"Harbor-UCLA Medical Center",program:"Harbor-UCLA Anesthesiology",city:"Torrance",state:"CA",director:"Program Director",email:"",website:"",size:"Community Academic"},
  {id:15,institution:"Keck School of Medicine USC",program:"USC Anesthesiology",city:"Los Angeles",state:"CA",director:"Program Director",email:"",website:"https://keck.usc.edu/anesthesiology",size:"Large Academic"},
  // COLORADO
  {id:16,institution:"University of Colorado",program:"CU Anesthesiology",city:"Aurora",state:"CO",director:"Program Director",email:"",website:"https://medschool.cuanschutz.edu/anesthesiology",size:"Large Academic"},
  // CONNECTICUT
  {id:17,institution:"Yale School of Medicine",program:"Yale Anesthesiology",city:"New Haven",state:"CT",director:"Program Director",email:"anes.residency@yale.edu",website:"https://medicine.yale.edu/anesthesiology",size:"Large Academic"},
  {id:18,institution:"UConn Health",program:"UConn Anesthesiology",city:"Farmington",state:"CT",director:"Program Director",email:"",website:"https://health.uconn.edu/anesthesiology",size:"Academic"},
  // FLORIDA
  {id:19,institution:"University of Florida",program:"UF Anesthesiology",city:"Gainesville",state:"FL",director:"Timothy Morey, MD",email:"anesresidency@anest.ufl.edu",website:"https://anest.ufl.edu",size:"Large Academic"},
  {id:20,institution:"University of Miami",program:"UM Anesthesiology",city:"Miami",state:"FL",director:"Program Director",email:"",website:"https://med.miami.edu/programs/anesthesiology",size:"Large Academic"},
  {id:21,institution:"University of South Florida",program:"USF Anesthesiology",city:"Tampa",state:"FL",director:"Program Director",email:"",website:"https://health.usf.edu/medicine/anesthesiology",size:"Academic"},
  {id:22,institution:"Mayo Clinic Florida",program:"Mayo Clinic Anesthesiology (FL)",city:"Jacksonville",state:"FL",director:"Program Director",email:"",website:"https://www.mayo.edu/research/departments-divisions/department-anesthesiology-perioperative-medicine",size:"Large Academic"},
  {id:23,institution:"Jackson Memorial Hospital",program:"Jackson Health Anesthesiology",city:"Miami",state:"FL",director:"Program Director",email:"",website:"",size:"Community Academic"},
  // GEORGIA
  {id:24,institution:"Emory University",program:"Emory Anesthesiology",city:"Atlanta",state:"GA",director:"Program Director",email:"anesthesiology@emory.edu",website:"https://med.emory.edu/departments/anesthesiology",size:"Large Academic"},
  {id:25,institution:"Medical College of Georgia",program:"MCG Anesthesiology",city:"Augusta",state:"GA",director:"Program Director",email:"",website:"https://www.augusta.edu/mcg/anesthesiology",size:"Academic"},
  // ILLINOIS
  {id:26,institution:"Northwestern University",program:"Northwestern Anesthesiology",city:"Chicago",state:"IL",director:"Program Director",email:"anes-residency@northwestern.edu",website:"https://www.feinberg.northwestern.edu/sites/anesthesiology",size:"Large Academic"},
  {id:27,institution:"University of Chicago",program:"UChicago Anesthesiology",city:"Chicago",state:"IL",director:"Program Director",email:"",website:"https://anesthesia.uchicago.edu",size:"Large Academic"},
  {id:28,institution:"Rush University",program:"Rush Anesthesiology",city:"Chicago",state:"IL",director:"Program Director",email:"",website:"https://www.rush.edu/services/anesthesiology",size:"Academic"},
  {id:29,institution:"University of Illinois Chicago",program:"UIC Anesthesiology",city:"Chicago",state:"IL",director:"Program Director",email:"",website:"https://chicago.medicine.uic.edu/departments/academic-departments/anesthesiology",size:"Academic"},
  // INDIANA
  {id:30,institution:"Indiana University",program:"IU Anesthesiology",city:"Indianapolis",state:"IN",director:"Program Director",email:"",website:"https://medicine.iu.edu/anesthesia",size:"Large Academic"},
  // IOWA
  {id:31,institution:"University of Iowa",program:"UI Anesthesiology",city:"Iowa City",state:"IA",director:"Program Director",email:"",website:"https://medicine.uiowa.edu/anes",size:"Large Academic"},
  // KENTUCKY
  {id:32,institution:"University of Kentucky",program:"UK Anesthesiology",city:"Lexington",state:"KY",director:"Program Director",email:"",website:"https://medicine.uky.edu/anesthesiology",size:"Academic"},
  {id:33,institution:"University of Louisville",program:"UofL Anesthesiology",city:"Louisville",state:"KY",director:"Program Director",email:"",website:"https://louisville.edu/medicine/departments/anesthesiology",size:"Academic"},
  // LOUISIANA
  {id:34,institution:"Tulane University",program:"Tulane Anesthesiology",city:"New Orleans",state:"LA",director:"Program Director",email:"",website:"https://medicine.tulane.edu/departments/anesthesiology",size:"Academic"},
  {id:35,institution:"LSU Health Sciences Center",program:"LSU Anesthesiology",city:"New Orleans",state:"LA",director:"Program Director",email:"",website:"https://www.medschool.lsuhsc.edu/anesthesiology",size:"Academic"},
  // MARYLAND
  {id:36,institution:"Johns Hopkins University",program:"Hopkins Anesthesiology",city:"Baltimore",state:"MD",director:"Program Director",email:"anesresidency@jhmi.edu",website:"https://www.hopkinsmedicine.org/anesthesiology_critical_care_medicine",size:"Large Academic"},
  {id:37,institution:"University of Maryland",program:"UMD Anesthesiology",city:"Baltimore",state:"MD",director:"Program Director",email:"",website:"https://www.umms.org/ummc/health-services/anesthesiology",size:"Large Academic"},
  // MASSACHUSETTS
  {id:38,institution:"Harvard/MGH",program:"MGH Anesthesia",city:"Boston",state:"MA",director:"Program Director",email:"anesthesia-residency@mgh.harvard.edu",website:"https://anesthesia.mgh.harvard.edu",size:"Large Academic"},
  {id:39,institution:"Harvard/Brigham and Women's",program:"BWH Anesthesia",city:"Boston",state:"MA",director:"Program Director",email:"",website:"https://www.brighamandwomens.org/anesthesiology-perioperative-and-pain-medicine",size:"Large Academic"},
  {id:40,institution:"Boston University",program:"BU Anesthesiology",city:"Boston",state:"MA",director:"Program Director",email:"",website:"https://www.bmc.org/anesthesiology",size:"Academic"},
  {id:41,institution:"UMass Chan Medical School",program:"UMass Anesthesiology",city:"Worcester",state:"MA",director:"Program Director",email:"",website:"https://www.umassmemorial.org/medical-services/anesthesiology",size:"Academic"},
  // MICHIGAN
  {id:42,institution:"University of Michigan",program:"Michigan Anesthesiology",city:"Ann Arbor",state:"MI",director:"Program Director",email:"anesresidency@med.umich.edu",website:"https://anesthesiology.med.umich.edu",size:"Large Academic"},
  {id:43,institution:"Wayne State University",program:"Wayne State Anesthesiology",city:"Detroit",state:"MI",director:"Program Director",email:"",website:"https://www.med.wayne.edu/anesthesiology",size:"Academic"},
  {id:44,institution:"Michigan State University",program:"MSU Anesthesiology",city:"East Lansing",state:"MI",director:"Program Director",email:"",website:"",size:"Academic"},
  // MINNESOTA
  {id:45,institution:"Mayo Clinic",program:"Mayo Clinic Anesthesiology",city:"Rochester",state:"MN",director:"Program Director",email:"anesthesiology@mayo.edu",website:"https://www.mayo.edu/research/departments-divisions/department-anesthesiology-perioperative-medicine",size:"Large Academic"},
  {id:46,institution:"University of Minnesota",program:"UMN Anesthesiology",city:"Minneapolis",state:"MN",director:"Program Director",email:"",website:"https://med.umn.edu/anes",size:"Large Academic"},
  // MISSOURI
  {id:47,institution:"Washington University in St. Louis",program:"WashU Anesthesiology",city:"St. Louis",state:"MO",director:"Program Director",email:"",website:"https://anesthesiology.wustl.edu",size:"Large Academic"},
  {id:48,institution:"University of Missouri",program:"MU Anesthesiology",city:"Columbia",state:"MO",director:"Program Director",email:"",website:"https://medicine.missouri.edu/departments/anesthesiology",size:"Academic"},
  // NEW YORK
  {id:49,institution:"Columbia University",program:"Columbia Anesthesiology",city:"New York",state:"NY",director:"Program Director",email:"",website:"https://www.columbiasurgery.org/anesthesiology",size:"Large Academic"},
  {id:50,institution:"Cornell/Weill",program:"Weill Cornell Anesthesiology",city:"New York",state:"NY",director:"Program Director",email:"",website:"https://anesthesiology.weill.cornell.edu",size:"Large Academic"},
  {id:51,institution:"NYU Langone",program:"NYU Anesthesiology",city:"New York",state:"NY",director:"Program Director",email:"",website:"https://med.nyu.edu/departments-institutes/anesthesiology",size:"Large Academic"},
  {id:52,institution:"Mount Sinai",program:"Icahn Anesthesiology",city:"New York",state:"NY",director:"Program Director",email:"",website:"https://icahn.mssm.edu/about/departments/anesthesiology",size:"Large Academic"},
  {id:53,institution:"Montefiore Medical Center",program:"Montefiore Anesthesiology",city:"Bronx",state:"NY",director:"Program Director",email:"",website:"https://www.montefiore.org/anesthesiology",size:"Large Academic"},
  {id:54,institution:"SUNY Downstate",program:"Downstate Anesthesiology",city:"Brooklyn",state:"NY",director:"Program Director",email:"",website:"https://www.downstate.edu/college-of-medicine/departments/anesthesiology",size:"Academic"},
  {id:55,institution:"University of Rochester",program:"UR Anesthesiology",city:"Rochester",state:"NY",director:"Program Director",email:"",website:"https://www.urmc.rochester.edu/anesthesiology.aspx",size:"Academic"},
  {id:56,institution:"Albany Medical Center",program:"Albany Anesthesiology",city:"Albany",state:"NY",director:"Program Director",email:"",website:"https://www.amc.edu/academic/gradmed/residencies/Anesthesiology.cfm",size:"Academic"},
  // NORTH CAROLINA
  {id:57,institution:"Duke University",program:"Duke Anesthesiology",city:"Durham",state:"NC",director:"Program Director",email:"anesthresidency@duke.edu",website:"https://anesthesiology.duke.edu",size:"Large Academic"},
  {id:58,institution:"UNC Chapel Hill",program:"UNC Anesthesiology",city:"Chapel Hill",state:"NC",director:"Program Director",email:"",website:"https://www.med.unc.edu/anesth",size:"Large Academic"},
  {id:59,institution:"Wake Forest University",program:"Wake Forest Anesthesiology",city:"Winston-Salem",state:"NC",director:"Program Director",email:"",website:"https://school.wakehealth.edu/departments/anesthesiology",size:"Academic"},
  // OHIO
  {id:60,institution:"Cleveland Clinic",program:"Cleveland Clinic Anesthesiology",city:"Cleveland",state:"OH",director:"Program Director",email:"anesresidency@ccf.org",website:"https://my.clevelandclinic.org/departments/anesthesiology",size:"Large Academic"},
  {id:61,institution:"Ohio State University",program:"OSU Anesthesiology",city:"Columbus",state:"OH",director:"Program Director",email:"",website:"https://anesthesiology.osu.edu",size:"Large Academic"},
  {id:62,institution:"Case Western/University Hospitals",program:"CWRU Anesthesiology",city:"Cleveland",state:"OH",director:"Program Director",email:"",website:"https://anesthesiology.case.edu",size:"Large Academic"},
  {id:63,institution:"University of Cincinnati",program:"UC Anesthesiology",city:"Cincinnati",state:"OH",director:"Program Director",email:"",website:"https://med.uc.edu/depart/anes",size:"Academic"},
  // OREGON
  {id:64,institution:"Oregon Health & Science University",program:"OHSU Anesthesiology",city:"Portland",state:"OR",director:"Program Director",email:"",website:"https://www.ohsu.edu/school-of-medicine/anesthesiology-perioperative-medicine",size:"Large Academic"},
  // PENNSYLVANIA
  {id:65,institution:"University of Pennsylvania",program:"Penn Anesthesiology",city:"Philadelphia",state:"PA",director:"Program Director",email:"anesresidency@pennmedicine.upenn.edu",website:"https://www.med.upenn.edu/anes",size:"Large Academic"},
  {id:66,institution:"Thomas Jefferson University",program:"Jefferson Anesthesiology",city:"Philadelphia",state:"PA",director:"Program Director",email:"",website:"https://hospitals.jefferson.edu/departments-and-services/anesthesiology.html",size:"Large Academic"},
  {id:67,institution:"Temple University",program:"Temple Anesthesiology",city:"Philadelphia",state:"PA",director:"Program Director",email:"",website:"https://medicine.temple.edu/departments/anesthesiology",size:"Academic"},
  {id:68,institution:"University of Pittsburgh",program:"Pitt Anesthesiology",city:"Pittsburgh",state:"PA",director:"Program Director",email:"",website:"https://www.anes.pitt.edu",size:"Large Academic"},
  {id:69,institution:"Penn State Health",program:"Penn State Anesthesiology",city:"Hershey",state:"PA",director:"Program Director",email:"",website:"https://med.psu.edu/anesthesiology",size:"Academic"},
  // TENNESSEE
  {id:70,institution:"Vanderbilt University",program:"Vanderbilt Anesthesiology",city:"Nashville",state:"TN",director:"Program Director",email:"",website:"https://www.vumc.org/anesthesiology",size:"Large Academic"},
  {id:71,institution:"University of Tennessee",program:"UT Anesthesiology",city:"Memphis",state:"TN",director:"Program Director",email:"",website:"https://www.uthsc.edu/anesthesiology",size:"Academic"},
  // TEXAS
  {id:72,institution:"UT Southwestern",program:"UTSW Anesthesiology",city:"Dallas",state:"TX",director:"Program Director",email:"anesthresidency@utsouthwestern.edu",website:"https://www.utsouthwestern.edu/departments/anesthesiology",size:"Large Academic"},
  {id:73,institution:"Baylor College of Medicine",program:"Baylor Anesthesiology",city:"Houston",state:"TX",director:"Program Director",email:"",website:"https://www.bcm.edu/departments/anesthesiology",size:"Large Academic"},
  {id:74,institution:"UT Health Houston",program:"UTHealth Anesthesiology",city:"Houston",state:"TX",director:"Program Director",email:"",website:"https://med.uth.edu/anesthesiology",size:"Academic"},
  {id:75,institution:"University of Texas San Antonio",program:"UTHSCSA Anesthesiology",city:"San Antonio",state:"TX",director:"Program Director",email:"",website:"https://medicine.uthscsa.edu/anesthesiology",size:"Academic"},
  // VIRGINIA
  {id:76,institution:"University of Virginia",program:"UVA Anesthesiology",city:"Charlottesville",state:"VA",director:"Program Director",email:"",website:"https://anesthesiology.virginia.edu",size:"Large Academic"},
  {id:77,institution:"Virginia Commonwealth University",program:"VCU Anesthesiology",city:"Richmond",state:"VA",director:"Program Director",email:"",website:"https://anesthesiology.vcu.edu",size:"Academic"},
  // WASHINGTON
  {id:78,institution:"University of Washington",program:"UW Anesthesiology",city:"Seattle",state:"WA",director:"Program Director",email:"",website:"https://anesthesiology.washington.edu",size:"Large Academic"},
  // WISCONSIN
  {id:79,institution:"University of Wisconsin",program:"UW Madison Anesthesiology",city:"Madison",state:"WI",director:"Program Director",email:"",website:"https://anesthesiology.wisc.edu",size:"Large Academic"},
  {id:80,institution:"Medical College of Wisconsin",program:"MCW Anesthesiology",city:"Milwaukee",state:"WI",director:"Program Director",email:"",website:"https://www.mcw.edu/departments/anesthesiology",size:"Academic"},
];

// ── FELLOWSHIP DATA ───────────────────────────────────────────────────────────
export const FELLOWSHIPS = [
  // REGIONAL
  {id:1,type:"Regional Anesthesia & Acute Pain",institution:"Hospital for Special Surgery",city:"New York",state:"NY",director:"Jacques YaDeau, MD",email:"anesthesiology@hss.edu",website:"https://www.hss.edu/education_fellowships-regional-anesthesia.asp",duration:"1 year"},
  {id:2,type:"Regional Anesthesia & Acute Pain",institution:"Mayo Clinic",city:"Rochester",state:"MN",director:"Program Director",email:"anesthesiology@mayo.edu",website:"https://www.mayo.edu",duration:"1 year"},
  {id:3,type:"Regional Anesthesia & Acute Pain",institution:"Cleveland Clinic",city:"Cleveland",state:"OH",director:"Program Director",email:"anesresidency@ccf.org",website:"https://my.clevelandclinic.org",duration:"1 year"},
  {id:4,type:"Regional Anesthesia & Acute Pain",institution:"Duke University",city:"Durham",state:"NC",director:"Program Director",email:"anesthresidency@duke.edu",website:"https://anesthesiology.duke.edu",duration:"1 year"},
  {id:5,type:"Regional Anesthesia & Acute Pain",institution:"University of Pittsburgh",city:"Pittsburgh",state:"PA",director:"Program Director",email:"",website:"https://www.anes.pitt.edu",duration:"1 year"},
  // CARDIAC
  {id:6,type:"Adult Cardiothoracic Anesthesia",institution:"Cleveland Clinic",city:"Cleveland",state:"OH",director:"Program Director",email:"anesresidency@ccf.org",website:"https://my.clevelandclinic.org",duration:"1 year"},
  {id:7,type:"Adult Cardiothoracic Anesthesia",institution:"Columbia University",city:"New York",state:"NY",director:"Program Director",email:"",website:"https://www.columbiasurgery.org/anesthesiology",duration:"1 year"},
  {id:8,type:"Adult Cardiothoracic Anesthesia",institution:"Mayo Clinic",city:"Rochester",state:"MN",director:"Program Director",email:"anesthesiology@mayo.edu",website:"https://www.mayo.edu",duration:"1 year"},
  {id:9,type:"Adult Cardiothoracic Anesthesia",institution:"Duke University",city:"Durham",state:"NC",director:"Program Director",email:"anesthresidency@duke.edu",website:"https://anesthesiology.duke.edu",duration:"1 year"},
  {id:10,type:"Adult Cardiothoracic Anesthesia",institution:"Johns Hopkins",city:"Baltimore",state:"MD",director:"Program Director",email:"anesresidency@jhmi.edu",website:"https://www.hopkinsmedicine.org",duration:"1 year"},
  {id:11,type:"Adult Cardiothoracic Anesthesia",institution:"University of Pennsylvania",city:"Philadelphia",state:"PA",director:"Program Director",email:"anesresidency@pennmedicine.upenn.edu",website:"https://www.med.upenn.edu/anes",duration:"1 year"},
  {id:12,type:"Adult Cardiothoracic Anesthesia",institution:"Stanford University",city:"Stanford",state:"CA",director:"Program Director",email:"anes-residency@stanford.edu",website:"https://med.stanford.edu/anesthesia.html",duration:"1 year"},
  // PAIN
  {id:13,type:"Pain Medicine",institution:"Cleveland Clinic",city:"Cleveland",state:"OH",director:"Program Director",email:"anesresidency@ccf.org",website:"https://my.clevelandclinic.org",duration:"1 year"},
  {id:14,type:"Pain Medicine",institution:"Mayo Clinic",city:"Rochester",state:"MN",director:"Program Director",email:"anesthesiology@mayo.edu",website:"https://www.mayo.edu",duration:"1 year"},
  {id:15,type:"Pain Medicine",institution:"Johns Hopkins",city:"Baltimore",state:"MD",director:"Program Director",email:"anesresidency@jhmi.edu",website:"https://www.hopkinsmedicine.org",duration:"1 year"},
  {id:16,type:"Pain Medicine",institution:"Stanford University",city:"Stanford",state:"CA",director:"Program Director",email:"anes-residency@stanford.edu",website:"https://med.stanford.edu/anesthesia.html",duration:"1 year"},
  {id:17,type:"Pain Medicine",institution:"University of Washington",city:"Seattle",state:"WA",director:"Program Director",email:"",website:"https://anesthesiology.washington.edu",duration:"1 year"},
  {id:18,type:"Pain Medicine",institution:"NYU Langone",city:"New York",state:"NY",director:"Program Director",email:"",website:"https://med.nyu.edu",duration:"1 year"},
  // NEURO
  {id:19,type:"Neuroanesthesia",institution:"Johns Hopkins",city:"Baltimore",state:"MD",director:"Program Director",email:"anesresidency@jhmi.edu",website:"https://www.hopkinsmedicine.org",duration:"1 year"},
  {id:20,type:"Neuroanesthesia",institution:"Mayo Clinic",city:"Rochester",state:"MN",director:"Program Director",email:"anesthesiology@mayo.edu",website:"https://www.mayo.edu",duration:"1 year"},
  {id:21,type:"Neuroanesthesia",institution:"Duke University",city:"Durham",state:"NC",director:"Program Director",email:"anesthresidency@duke.edu",website:"https://anesthesiology.duke.edu",duration:"1 year"},
  {id:22,type:"Neuroanesthesia",institution:"University of Pennsylvania",city:"Philadelphia",state:"PA",director:"Program Director",email:"",website:"https://www.med.upenn.edu/anes",duration:"1 year"},
  // PEDIATRIC
  {id:23,type:"Pediatric Anesthesia",institution:"Children's Hospital of Philadelphia",city:"Philadelphia",state:"PA",director:"Program Director",email:"",website:"https://www.chop.edu",duration:"1 year"},
  {id:24,type:"Pediatric Anesthesia",institution:"Boston Children's Hospital",city:"Boston",state:"MA",director:"Program Director",email:"",website:"https://www.childrenshospital.org",duration:"1 year"},
  {id:25,type:"Pediatric Anesthesia",institution:"Cincinnati Children's",city:"Cincinnati",state:"OH",director:"Program Director",email:"",website:"https://www.cincinnatichildrens.org",duration:"1 year"},
  {id:26,type:"Pediatric Anesthesia",institution:"Texas Children's Hospital",city:"Houston",state:"TX",director:"Program Director",email:"",website:"https://www.texaschildrens.org",duration:"1 year"},
  {id:27,type:"Pediatric Anesthesia",institution:"Children's National",city:"Washington",state:"DC",director:"Program Director",email:"",website:"https://www.childrensnational.org",duration:"1 year"},
  {id:28,type:"Pediatric Anesthesia",institution:"Lucile Packard/Stanford",city:"Stanford",state:"CA",director:"Program Director",email:"",website:"https://med.stanford.edu/anesthesia.html",duration:"1 year"},
  // CRITICAL CARE
  {id:29,type:"Critical Care Medicine",institution:"Johns Hopkins",city:"Baltimore",state:"MD",director:"Program Director",email:"anesresidency@jhmi.edu",website:"https://www.hopkinsmedicine.org",duration:"1 year"},
  {id:30,type:"Critical Care Medicine",institution:"Mayo Clinic",city:"Rochester",state:"MN",director:"Program Director",email:"anesthesiology@mayo.edu",website:"https://www.mayo.edu",duration:"1 year"},
  {id:31,type:"Critical Care Medicine",institution:"University of Pittsburgh",city:"Pittsburgh",state:"PA",director:"Program Director",email:"",website:"https://www.anes.pitt.edu",duration:"1 year"},
  {id:32,type:"Critical Care Medicine",institution:"Columbia University",city:"New York",state:"NY",director:"Program Director",email:"",website:"https://www.columbiasurgery.org/anesthesiology",duration:"1 year"},
  {id:33,type:"Critical Care Medicine",institution:"Cleveland Clinic",city:"Cleveland",state:"OH",director:"Program Director",email:"anesresidency@ccf.org",website:"https://my.clevelandclinic.org",duration:"1 year"},
  // OB
  {id:34,type:"Obstetric Anesthesia",institution:"Brigham and Women's",city:"Boston",state:"MA",director:"Program Director",email:"",website:"https://www.brighamandwomens.org",duration:"1 year"},
  {id:35,type:"Obstetric Anesthesia",institution:"Columbia University",city:"New York",state:"NY",director:"Program Director",email:"",website:"https://www.columbiasurgery.org/anesthesiology",duration:"1 year"},
  {id:36,type:"Obstetric Anesthesia",institution:"Stanford University",city:"Stanford",state:"CA",director:"Program Director",email:"anes-residency@stanford.edu",website:"https://med.stanford.edu/anesthesia.html",duration:"1 year"},
  {id:37,type:"Obstetric Anesthesia",institution:"University of Washington",city:"Seattle",state:"WA",director:"Program Director",email:"",website:"https://anesthesiology.washington.edu",duration:"1 year"},
  // GLOBAL
  {id:38,type:"Global Health Anesthesia",institution:"Duke University",city:"Durham",state:"NC",director:"Program Director",email:"anesthresidency@duke.edu",website:"https://anesthesiology.duke.edu",duration:"1 year"},
  {id:39,type:"Global Health Anesthesia",institution:"University of Michigan",city:"Ann Arbor",state:"MI",director:"Program Director",email:"anesresidency@med.umich.edu",website:"https://anesthesiology.med.umich.edu",duration:"1 year"},
  // RESEARCH
  {id:40,type:"Research / Academic Fellowship",institution:"Harvard/MGH",city:"Boston",state:"MA",director:"Program Director",email:"anesthesia-residency@mgh.harvard.edu",website:"https://anesthesia.mgh.harvard.edu",duration:"1-2 years"},
  {id:41,type:"Research / Academic Fellowship",institution:"Stanford University",city:"Stanford",state:"CA",director:"Program Director",email:"anes-residency@stanford.edu",website:"https://med.stanford.edu/anesthesia.html",duration:"1-2 years"},
];

export const FELLOWSHIP_TYPES = [...new Set(FELLOWSHIPS.map(f=>f.type))];
export const US_STATES = [...new Set(RESIDENCY_PROGRAMS.map(p=>p.state))].sort();

// ── URL SLUGS ────────────────────────────────────────────────────────────────
// Stable, human-readable slugs for per-program pages. Residency institutions
// are unique on their own; fellowship institutions repeat across subspecialty
// types, so their slug includes the type.
export const slugify = (s) =>
  s.toLowerCase()
   .replace(/['’]/g, "")
   .replace(/&/g, " and ")
   .replace(/[^a-z0-9]+/g, "-")
   .replace(/^-+|-+$/g, "");

export const residencySlug  = (p) => slugify(p.institution);
export const fellowshipSlug = (f) => slugify(`${f.type} ${f.institution}`);

export const findResidency  = (slug) => RESIDENCY_PROGRAMS.find(p => residencySlug(p) === slug);
export const findFellowship = (slug) => FELLOWSHIPS.find(f => fellowshipSlug(f) === slug);
