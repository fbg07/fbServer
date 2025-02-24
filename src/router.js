import { Router } from "express";
import { adminlogin } from "./Controllers/admin.js";
import { addbroker , deletebroker , getbroker} from "./Controllers/broker.js";
import { getdashboardnumbers } from "./Controllers/dashboard.js";
import { addProperties , getproperties , deleteproperties} from "./Controllers/properties.js";
import { addvariables, deletevariable, getvariables } from "./Controllers/variables.js";

const approuter = Router();

//Admin routes
approuter.post("/api/adminlogin" , adminlogin);


//Broker routes
approuter.post("/api/addbroker" , addbroker);
approuter.post("/api/deletebroker" , deletebroker);
approuter.get("/api/getbrokers" , getbroker);

//Dashboard Routes
approuter.get("/api/getdashboardnumbers" , getdashboardnumbers);


//Properties routes
approuter.post("/api/addproperties",addProperties);
approuter.get("/api/getproperties",getproperties);
approuter.post("/api/deleteproperties",deleteproperties);

//Varaible Routes
approuter.post("/api/addvariables",addvariables);
approuter.get("/api/getvariables", getvariables);
approuter.post("/api/deletevariable", deletevariable);








export default approuter;