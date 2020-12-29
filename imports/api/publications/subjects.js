import { Meteor } from "meteor/meteor"
import Subjects from "../collections/Subjects";

Meteor.publish("subjects",function(){
    return Subjects.find({});
})