
/* 
============================================
== Graph Processing ==
============================================

Description:
The following code identifies the 10 shortest flight routes (distance-wise).
*/

//Import relevant libraries
import org.apache.spark.graphx._
import org.apache.spark.rdd.RDD
import scala.util.MurmurHash
//set lg level off to enhance readability
sc.setLogLevel("OFF")
//First, load flight transportation data into Spark Shell
val flights = spark.read.format("csv").option("header", "false").load("test.csv.bz2")
/*
Create RDD of airportCodes based on origin and destination airports
*/
val airportCodes = flights.select($"_c6", $"_c8").rdd.flatMap(x => Iterable(x(0).toString, x(1).toString))
/*
Create Vertices of graph on the basis of airportCodes
by mapping distinct airportCodes to a hashed Vertex ID.
Define default for missing airports
*/
val vertices: RDD[(VertexId, String)] = airportCodes.distinct().map(x => (MurmurHash.stringHash(x), x))
val defaultVertex = ("Missing")
//create RDD of flight origins, destinations and distance 
val fromToDist = flights.select($"_c6", $"_c8",$"_c16").rdd
/*
Create edges on the basis of hashed origin and destination airport codes.
Assign the distance as weight for each edge.
*/
val edges = fromToDist.map(x => ((MurmurHash.stringHash(x(0).toString),MurmurHash.stringHash(x(1).toString)), x(2).toString.toInt)).reduceByKey(math.min(_,_)).map(x =>Edge(x._1._1, x._1._2,x._2))
/*
Create the graph on the basis of
the previously created edges and vertices
*/
val flightsGraph = Graph(vertices, edges, defaultVertex)
/*
sort graph according to weights of edges (distance)
in an ascending order and print top 10 values
*/
flightsGraph.triplets.sortBy(_.attr, ascending = true).map(triplet => "The distance from " + triplet.srcAttr + " to " + triplet.dstAttr + " is " + triplet.attr.toString + " km.\n").take(10)
