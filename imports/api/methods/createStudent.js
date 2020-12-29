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
    "deleteStudent"(id){
        return Students.remove({_id:id});
    },
    "updateStudent"(id,list){
        return Students.update({_id:id},{$set: { subjects: list }})
    },
    "updateStudentSubjectDeleted"(id,subject){
        return Students.update({_id:id},{$pull:{"subjects":subject}});
    }
})