<template>
  <div class="container">
    <div class="menuBar">
      <ul class="nav-style">
        <li><button class="button btn btn-secondary" @click="select('stForm')">Add Student</button></li>
        <li><button class="button btn btn-secondary" @click="select('stList')">Student List</button></li>
        <li><button class="button btn btn-secondary" @click="select('sbForm')">Add Subject</button></li>
        <li><button class="button btn btn-secondary" @click="select('sbList')">Subject List</button></li>
        <li><button class="button btn btn-secondary" @click="select('asSubject')">subjectAssign</button></li>
      </ul>
    </div>
    <div v-show="stForm">
        <form class="form-group" style="margin:0 auto;">
          <input type="text" class="form-control col-md-5 mb-3" v-model="name" name="name" placeholder="Name" required>
          <input type="text" class="form-control col-md-5 mb-3" v-model="email" name="email" placeholder="Email" required>
          <input type="text" class="form-control col-md-5 mb-3" v-model="phone" name="phone" placeholder="Phone Number">
          <input type="date" class="form-control col-md-5 mb-3" v-model="birthDate" name="birthDate" placeholder="Birth Date">
          <input type="submit" class="btn btn-primary col-md-3 mb-4" name="submit" @click="addStudent($event)" value="Add new Student">
        </form>
    </div>
    <div v-show="stList">
       <table class="table">
        <thead>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Date of birth</th>
          <th>Subjects</th>
          <th>Action</th>
        </thead>
        <tr v-for="student in students" :key="student._id">
          <td>{{student.name}}</td>
          <td>{{student.email}}</td>
          <td>{{student.phone}}</td>
          <td>{{student.birthDate}}</td>
          <td>{{showData(student)}}</td>
          <td><button class="btn btn-danger" @click="deleteStudent(student)">Delete</button></td>
        </tr>
      </table>
    </div>
    <div v-show="sbForm">
      <form class="form-group">
          <input type="text" class="form-control col-md-5 mb-3" v-model="title" name="title" placeholder="title" required>
          <input type="submit" class="btn btn-primary col-md-2" name="submit" @click="addSubject($event)" value="Add Subject">
      </form>
    </div>
    <div v-show="sbList">
      <table class="table">
        <thead>
          <th>Title</th>
          <th>Students</th>
          
        </thead>
        <tr v-for="subject in subjects" :key="subject.title">
          <td>
            {{subject.title}}
          </td>
          <td>{{showStudents(subject)}}</td>
          <td><button @click="deleteSubject(subject)" class="btn btn-danger">Delete</button></td>
        </tr>
      </table>
    </div>

    <div v-show="asSubject">
      <table class="table" v-show="hideList">
        <thead>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Date of birth</th>
          <th>Subjects</th>
          <th>AsignSubject</th>
          
        </thead>
        <tr v-for="student in students" :key="student._id">
          <td>{{student.name}}</td>
          <td>{{student.email}}</td>
          <td>{{student.phone}}</td>
          <td>{{student.birthDate}}</td>
          <td>{{showData(student)}}</td>
          <td><button class="btn btn-light" @click="asignSubject(student)">assign Subject</button></td>
        </tr>
      </table>

      <div>
        <table class="table">
          <thead>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Subjects</th>
          </thead>
          <tr>
            <td>{{selectedStudent.name}}</td>
            <td>{{selectedStudent.email}}</td>
            <td>{{selectedStudent.phone}}</td>
            <td>{{selectedSubjectList()}}</td>
          </tr>
      </table>

      <ul style="list-style:none; display:inline-flex;">
          <li v-for="subject in subjects" :key="subject.title" class="mr-3"><button class="btn btn-success" @click="allocSub(subject)">{{subject.title}}</button></li>
      </ul>

      <div class="row">
        <!-- <button class="btn btn-primary" @click="updateSubject()">updateSubject</button> -->
        <button style="margin:0 auto;" class="btn btn-primary" @click="saveAllocatedSubjects()">Save</button>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import Students from '../../api/collections/Students'
import Subjects from "../../api/collections/Subjects"
export default {
  data() {
    return {
      hideList:true,
      stForm:true,
      stList:false,
      sbForm:false,
      sbList:false,
      asSubject:false,
      name: "",
      email: "",
      phone: "",
      birthDate: null,
      title: "",
      selectedStudent:{},
      subjectList:[],
      selectedSubject:null,
      subjectListId:[],
    }
  },
  meteor: {
    $subscribe: {
      'students': [],
      'subjects':[]
    },
    students () {
      return Students.find({})
    },
    subjects(){
      return Subjects.find({});
    }
  },
  methods: {
    showStudents(subject){
      let val;
      if(subject.students){
        val = subject.students.map(s=>{
          // console.log(s.student.name)
          // console.log(s.student.email)
          return s.student.name}).toString();
      }
      return val;
    },
    selectedSubjectList(){
      if(this.subjectList){
        return this.subjectList.map(x=>{return x.title}).toString()
      }
      return ""
    },
    showData(student){
      let val;
      if(student.subjects){
        val = student.subjects.map(s=>{return s.title}).toString();
        //console.log(val)
      }
      return val;
    },
    allocSub(sub){
      let subject = this.subjectList.find(s=>{return s._id == sub._id});
      if(!subject){
        this.subjectList.push({_id:sub._id,title:sub.title});
      }
    },
    asignSubject(student){
      //this.hideList = false;
      this.selectedStudent = student;
      this.subjectList = student.subjects ? student.subjects : [];
    },
    deleteStudent(student){
      Meteor.call("deleteStudent",student._id,(error)=>{
        if(error){
          alert(error)
        }else{
          console.log("Success in Delete");
          this.removeStudentFromSubject(student);
        }
      })
    },
    
    saveAllocatedSubjects(){
      event.preventDefault()
      
      Meteor.call('updateStudent',this.selectedStudent._id,this.subjectList,(error)=>{
        if(error){
          alert(error);
        }else{
          this.subjectList.forEach(sub => {
            if(sub.students){
              isStudent = sub.students.find(s=> {return s.student._id == this.selectedStudent._id});
              if(isStudent){
                  console.log(isStudent.name)
              }else{
                console.log("colling updateSubject");
                console.log(sub._id);
                console.log(this.selectedStudent);
                updateSubject(sub._id,this.selectedStudent);
                
              }
            }
            else{
              //console.log("colling updateSubject",sub._id,this.selectedStudent);
              this.updateSubject(sub._id,this.selectedStudent);
            }
          });
          this.subjectList=null
          console.log("success"+ this.subjectList);
        }
      })
    },updateSubject(id,student){
      tempStudent={_id:student._id,name:student.name}
      Meteor.call('updateSubject',id,tempStudent,(error)=>{
        if(error){
          alert(error);
        }
        else{
          console.log("success in subjectUpdate");
        }
      })
    },
    addSubject(event){
      event.preventDefault()
      Meteor.call('createSubject',this.title,(error)=>{
        if(error){
          alert(error);
        }else{
          this.title="",
          console.log("success")
        }
      })
    },
    addStudent(event){
      event.preventDefault()
      Meteor.call('createStudent', this.name, this.email, this.phone, this.birthDate, (error) => {
        if (error) {
          alert(error.error)
        } else {
          console.log("success");
          this.name = ''
          this.email = ''
          this.phone = '',
          this.birthDate =null
        }
      })
    },
    deleteSubject(subject){
      
      Meteor.call("deleteSubject",subject._id,(error)=>{
        if(error){
          alert(error)
        }else{
          console.log("Success in Delete");
          this.removeSubjectOperation(subject);
        }
      })
    },
    removeSubjectOperation(subject){
      demosubject = {_id:subject._id,title:subject.title}
      this.students.forEach(e=>{
        console.log(demosubject);

        Meteor.call("updateStudentSubjectDeleted",e._id,demosubject,(error)=>{
          if(error){
            alert(error)
          }else{
            console.log("deleted One time");
          }
        })
      })
    },
    removeStudentFromSubject(student){
      this.subjects.forEach(e=>{
        console.log(student);
        let tempStudent={student:{_id:student._id,name:student.name}}
        console.log(tempStudent)
        Meteor.call("removeStudentFromSubject",e._id,tempStudent,(error)=>{
          if(error){
            alert(error)
          }else{
            console.log("deleted Students from Subject");
          }
        })
      })
    },
     select(id){
      switch(id){
        case "stForm":
          this.stForm = true,
          this.stList=false,
          this.sbForm=false,
          this.sbList=false,
          this.asSubject=false
          break
        case "stList":
          this.stForm = false,
          this.stList=true,
          this.sbForm=false,
          this.sbList=false,
          this.asSubject=false
          break
        case "sbForm":
          this.stForm = false,
          this.stList=false,
          this.sbForm=true,
          this.sbList=false,
          this.asSubject=false
          break
        case "sbList":
          this.stForm = false,
          this.stList=false,
          this.sbForm=false,
          this.sbList=true,
          this.asSubject=false
          break
        case "asSubject":
          this.stForm = false,
          this.stList=false,
          this.sbForm=false,
          this.sbList=false,
          this.asSubject=true
          break
      }
    }
  },
 
}
</script>

<style scoped>
  ul {
    font-family: monospace;
  }
  .nav-style{
    list-style: none;
    display: inline-flex !important;
  }
  .button{
    margin-right: 20px;
    padding: 10px 20px;
  }
</style>
