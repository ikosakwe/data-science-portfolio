
## Background
StopFire is a campaign started by Monash University to predict and stop the fire in
Victorian cities. They have employed sensors in different cities of Victoria and have
collected a large amount of data.

Climate data is recorded on a daily basis whereas Fire (hotspot) data is recorded based on the
occurrence of a fire on a particular day.

The goal of this project is to build an application, a
complete setup from streaming to storing and analyzing the data using Apache
Kafka, Apache Spark Streaming and MongoDB.

## Usage
1. Run the app ["Build_Database"](https://github.com/ikosakwe/data-science-portfolio/blob/master/Fire_Stream_Processing_Pipeline_Python/Build_Database.ipynb) to create and populate the mongodb database.

2. Change into your Kafka directory ([you can download Apache Kafka here](https://kafka.apache.org/downloads)) and run the following commands. 

    <p> Start zookeeper service </p>
   <p> $ bin/zookeeper-server-start.sh config/zookeeper.properties</p> 

    <p> Start kafka service </p>
   <p>  $ bin/kafka-server-start.sh config/server.properties </p>

3. Run all 3 "Producer" applications.

4. To process and insert the newly produced data into the database created in step 1, run the ["Streaming_Application"](https://github.com/ikosakwe/data-science-portfolio/blob/master/Fire_Stream_Processing_Pipeline_Python/Streaming_Application.ipynb) program.

5. To visualize the data stream, open and run the ["Data_Visualisation"](https://github.com/ikosakwe/data-science-portfolio/blob/master/Fire_Stream_Processing_Pipeline_Python/Data_Visualisation.ipynb) program.
