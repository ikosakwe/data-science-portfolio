# Analyzing Flight Data with Graph Processing

The goal of this graph processing application is to identify and display the 10 shortest (distance-wise)
airline routes (assumption: a route is a fight from origin airport to destination airport). The following libraries were used in 
carrying out the processing.

### RDD:

Resilient Distributed Datasets (RDD) as the fundamental parallel data structure in Spark allow a
distributed and immutable collection of objects (Apache Spark). They will be used as basis for the
property graph.

### GraphX:

Spark’s GraphX library offers high performing graph systems such as property graphs. Property
Graphs allow user defined specifications for their edges and vertices and have RDD like
characteristics (Apache Spark). Consequently, they are immutable, distributed and fault-tolerant.

### MurmurHash:

MurmurHash is a non-cryptographic hash function and may be used for general hash-based lookups
(EPFL). In this project MurmurHash is used to convert airport codes into unique IDs.
After importing the relevant libraries and setting off the log level to enhance readability, the airline
transportation dataset in form of a csv-file is imported. The file does not have headers. 
