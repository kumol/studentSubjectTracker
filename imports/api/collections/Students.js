import { Mongo } from 'meteor/mongo';
import Subjects from './Subjects';

export default new Mongo.Collection('students',{schema:{
    name: {
        type: String
    },
    email:{
        type:String
    },
    phone:{
        type: String
    },
    birthDate:{
        type: Date
    },
    subjects:{
        type:[Subjects],
        optional:true
    }
}});
