import {Meteor } from "meteor/meteor";
import Subjects from "../collections/Subjects";

Meteor.methods({
    "createSubject"(title){
        return Subjects.insert({title});
    },
    "updatesubject"(_id,list){
        return Subjects.update({_id},{$set:{students:list}})
    }
})