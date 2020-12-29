import {Meteor } from "meteor/meteor";
import Subjects from "../collections/Subjects";

Meteor.methods({
    "createSubject"(title){
        return Subjects.insert({title});
    },
    "updateSubject"(_id,student){
        console.log(student);
        return Subjects.update({_id},{$push: { students: { student } }});
    }
})