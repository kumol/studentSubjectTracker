import {Meteor } from "meteor/meteor";

import Students from "../collections/Students";

Meteor.methods({
    "createStudent"(name,email,phone,birthDate){
        return Students.insert({
            name,
            email,
            phone,
            birthDate,
            subjects:[]
        })
    },
    "updateStudent"(id,list){
        return Students.update({_id:id},{$set: { subjects: list }})
    }
})