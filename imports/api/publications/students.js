import { Meteor } from "meteor/meteor"

import Students from "../collections/Students"

Meteor.publish("students",function(){
    return Students.find({});
})