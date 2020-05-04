# Visualizing-COVID-19

## Data Sources
Data is pulled live from the [NYC Heath Coronavirus GitHub Repository](https://github.com/nychealth/coronavirus-data)

## Background Studies

## Study #1

### Chinese Wuhan Study

### Substantial undocumented infection facilitates the rapid dissemination of novel coronavirus (SARS-CoV-2)

[https://science.sciencemag.org/content/368/6490/489](https://science.sciencemag.org/content/368/6490/489)

Multiplier for the app: 
86% of infections undetected in Wuhan prior to travel closures in January 23, 2020 (i.e. no mandatory testing). 
14 / 100 cases are detected, this is the infected population.
Reciprocal gives you the multiple of the infected population that is undocumented. 100 / 14 = 7.14x.
95% confidence interval used with a range of 82-90% undetected. Implying that in 2.5% of tested cases, the multiple would be higher, but in only 2.5% of cases would the amount of undocumented cases be lower than 82%, roughly a 7x multiple. 

Summary: The rate at which the infection spread in Wuhan made scientists suspicious of the number of documented infections. If the number of documented infections was the entire infected population in Wuhan during the periods where data was analyzed, it would suggest that the virus has a very high rate of infection of others per infected individual. The alternative hypothesis is that the number of infected people who were undocumented, whether they were concealing the illness or were unaware that they had it, was much higher to explain the transmissibility through the population of Wuhan. 

## Study #2

### Japanese Diamond Princess Study

### Estimating the asymptomatic proportion of coronavirus disease 2019 (COVID-19) cases on board the Diamond Princess cruise ship, Yokohama, Japan, 2020

[https://med.stanford.edu/content/dam/sm/id/documents/COVID/AsymptCOVID_TransmissionShip.pdf](https://med.stanford.edu/content/dam/sm/id/documents/COVID/AsymptCOVID_TransmissionShip.pdf)

Multiplier for the App: 
3711 people aboard the Diamond Princess underwent 2 week quarantine after former passenger was found to have the virus. 
634 people after a 2-week incubation period tested positive after quarantine was lifted. 
Estimated asymptomatic proportion was 17.9%. 
Implies asymptomatic population is 18% higher than documented confirmed cases. 
Multiplier of 1.18x.

Summary: Much tighter confidence interval for this study for 95% interval between 15.5 - 20.2%. So 2.5% of the time, the asymptomatic population would have fallen below that range, and the other 2.5% of the time, it would have been above. The confined settings of the cruise ship are what sets this study apart and may make not as reliable as other epidemiological studies where, despite embarkations along the voyage to ports such as Hong Kong, there was much less contact with the general population than among other groups. 

## Study #3

### Journal of Infectious Diseases Method

### Estimation of asymptomatic ratio of novel coronavirus infections (COVID-19)

[https://www.ijidonline.com/article/S1201-9712(20)30139-9/pdf](https://www.ijidonline.com/article/S1201-9712(20)30139-9/pdf)

Multiplier for the App: 
Among a group of Japanese citizens airlifted out of Wuhan, about 11.2% of them were considered symptomatic upon arrival. 
Using Bayes Theorem, the asymptomatic ratio was then calculated from the number of positive coronavirus tests. 
The asymptomatic ratio among all evacuees was estimated to be 30.8%. Implying a 1.31x multiplier. 

Summary: Very loose confidence intervals here, so this method is likely highly imprecise. 95% confidence interval of 7.7% - 53.8%. So the real multiplier could be closer to 1.5x and still be consistent with the results of this study.  


## Study #4

### BMJ / British Medical Journal

### Covid-19: Identifying and Isolating Asymptomatic People helped eliminate virus in Italian village

[https://www.bmj.com/content/368/bmj.m1165](https://www.bmj.com/content/368/bmj.m1165)

Multiplier for the App: 
Among those infected with covid-19, based on random repeated RNA testing of the entire population in the town of Vo-Euganeo revealed that 50-75% of all infections were asymptomatic. 
The mayor said that they represented a “formidable source” of the contagion. 
Since this is a percentage of total infections, not total population, this multiplier is 2x - 4x, more in line with the Chinese study. 

Summary: Very small sample size here obscure the generalizability of the epidemiological results. Their highest case count with mandatory RNA testing of everyone was 88 people out of 300, but the number of asymptomatic cases in such a small area is interesting. 


## Study #5

### Stanford Antibody Test / Nature Article

### Antibody tests suggest that coronavirus infections vastly exceed official counts

[https://www.nature.com/articles/d41586-020-01095-0](https://www.nature.com/articles/d41586-020-01095-0)

Multiplier for the App: 
Study’s estimate relies on examination of 3300 people in Santa Clara county in early April. One in 66 people there had been infected as detected by antibodies, and if extrapolated, shows that between 48,000 and 82,000 people were infected out of 2 million inhabitants.
This multiplier is enormous, given official case count in the county of 1,000 people in early April, it is suggesting a multiplier of 48x to 82x. 
However, a major criticism is the higher false positive rate in antibody tests as opposed to real covid tests. The article cites 50% false positive rate (what!), so for conservatism, the adjusted multiplier should probably be closer to 24x.

Summary: Antibody tests are much more “shoot-from-the-hip” way of detecting the coronavirus and have a much higher false positive rate than real tests. Additionally, there are antibodies that can be associated with more than one type of viral infection. Thus, the presence of antibodies “associated” with the coronavirus may be misleading, as they could also be associated with other viral infections as well. 


## Study #6

### New England Journal of Medicine Editorial 

### Asymptomatic Transmission, the Achilles Heel of Current Strategies to Control Covid-19

[https://www.nejm.org/doi/full/10.1056/NEJMe2009758](https://www.nejm.org/doi/full/10.1056/NEJMe2009758)

Multiplier for the App: 
Looks closely at nursing home deaths and spread. 
Discusses how symptom based screening does little to prevent the spread of the virus, since most patients are either “pre symptomatic” or “asymptomatic.”
Nursing home data shows 63% are asymptomatic, although many might be presymptomatic. Their reinterpretation is that 56% were essentially asymptomatic, making it a 2.5x multiplier.

Summary: This editorial has the benefit of summarizing several different reports from the emerging epicenters of covid-related deaths and infections - nursing homes. It also discusses the difference between cases that may just be presymptomatic versus asymptomatic, saying some amount of cases that could be considered “asymptomatic” early on, later on develop symptoms, and thus can be reclassified as presymptomatic. Their estimate falls more in line with the controlled population studies done. 