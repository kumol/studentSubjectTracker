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
      <h2>Student Input Form</h2>
      <hr/>
        <form class="form-group" style="margin:0 auto;">
          <input type="text" class="form-control col-md-7 mb-3 centerized" v-model="name" name="name" placeholder="Name" required >
          <input type="text" class="form-control col-md-7 mb-3 centerized" v-model="email" name="email" placeholder="Email" required >
          <input type="text" class="form-control col-md-7 mb-3 centerized" v-model="phone" name="phone" placeholder="Phone Number" >
          <input type="date" class="form-control col-md-7 mb-3 centerized" v-model="birthDate" name="birthDate" placeholder="Birth Date">
          <div class="centerized col-md-5" style="text-align:center">
            <input type="submit" class="btn btn-primary mb-4 " name="submit" @click="addStudent($event)" value="Add new Student" >
          </div>
        </form>
    </div>
    <div v-show="stList">

      <h2>Students List </h2>
      <hr/>
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
      <h2>Subject Input Form</h2>
      <hr/>
      <form class="form-group">
          <input  type="text" class="form-control col-md-7 mb-3 centerized" v-model="title" name="title" placeholder="title" required>
          <div class="centerized col-md-5" style="text-align:center"><button type="submit" class="btn btn-primary" name="submit" @click="addSubject($event)" >Add Subject</button>
</div>
      </form>
    </div>
    <div v-show="sbList">
      <h2>Subjects List</h2>
      <hr/>
      <table class="table">
        <thead>
          <th>Title</th>
          <th>Students</th>
          <th>Action</th>
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
      <h2>Assign subject to the students </h2>
      <hr/>
      <table class="table" v-show="!hideSelectionList">
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
          <td><button class="btn btn-light" @click="selectStudent(student)">assign Subject</button></td>
        </tr>
      </table>

      <div v-show="hideSelectionList">
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
          <li><button style="margin:0 auto;" class="btn btn-primary" @click="saveAllocatedSubjects()">Save</button>
</li>
      </ul>
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
      hideSelectionList:false,
      stForm:false,
      stList:true,
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
      let displayString;
      if(subject.students){
        displayString = subject.students.map(s=>{
          return s.student.name}).toString();
      }
      return displayString;
    },
    selectedSubjectList(){
      if(this.subjectList){
        return this.subjectList.map(x=>{return x.title}).toString()
      }
      return ""
    },
    showData(student){
      let displayString;
      if(student.subjects){
        displayString = student.subjects.map(s=>{return s.title}).toString();
        //console.log(val)
      }
      return displayString;
    },
    allocSub(sub){
      let index = this.subjectList.findIndex(s=>{return s._id == sub._id});
      if(index == -1){
        this.subjectList.push({_id:sub._id,title:sub.title});
      }
    },
    selectStudent(student){
      this.hideSelectionList = true;
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
          this.hideSelectionList = false

          this.subjectList.forEach(sub=>{
            //index = this.selectedStudent.subjects.findIndex(subject=>{return subjcect._id==sub._id});
            subject = this.subjects.find(subject=>{return subject._id == sub._id});
            if(subject.students){
              indexStudent = subject.students.findIndex(s=>{return s.student._id == this.selectedStudent._id})
              console.log("indexing student" ,indexStudent );
              if(indexStudent<0){
                this.updateSubject(sub._id,this.selectedStudent);
              }
            }else{
              this.updateSubject(sub._id,this.selectedStudent);
            }
          })
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
          this.asSubject=false,
          this.hideSelectionList=false
          break
        case "stList":
          this.stForm = false,
          this.stList=true,
          this.sbForm=false,
          this.sbList=false,
          this.asSubject=false,
          this.hideSelectionList=false
          break
        case "sbForm":
          this.stForm = false,
          this.stList=false,
          this.sbForm=true,
          this.sbList=false,
          this.asSubject=false,
          this.hideSelectionList=false
          break
        case "sbList":
          this.stForm = false,
          this.stList=false,
          this.sbForm=false,
          this.sbList=true,
          this.asSubject=false,
          this.hideSelectionList=false
          break
        case "asSubject":
          this.stForm = false,
          this.stList=false,
          this.sbForm=false,
          this.sbList=false,
          this.asSubject=true,
          this.hideSelectionList=false
          break
      }
    }
  },
 
}
</script>

<style scoped>
  .nav-style{
    list-style: none;
    display: inline-flex !important;
  }
  .button{
    margin-right: 20px;
    padding: 10px 20px;
  }
  .centerized{
    margin:0 auto;
  }
</style>
