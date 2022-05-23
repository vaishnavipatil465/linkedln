import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup,Validators } from '@angular/forms';
import { AddPostService } from './add-post.service';
import * as moment from 'moment';
// import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {
  addPostForm:any;
  commentForm:any;
  replyForm:any;
  isComment=false;
  isReply=false;
  isLike=false;
  isReplyLike=false;
  value:any;
  submitted = false;
  comment:any;
  file: any;
  data:any={};
  params:any;
  @Output() add = new EventEmitter<string>();
  imageUrl: any;
  currentPage: number = 1;
  recordsPerPage: number = 7;
  totalRecords: number = 30;
  currentUser:string='6162ca236a540e2144b1682b';
  comment_id:string='';
  p=1;
  moment=moment;


  // initialCount = 100;

  constructor(
    private formBuilder: FormBuilder,
    private addpostservice:AddPostService,
    ) { }

  ngOnInit(): void {
    this.fetchPost();
    this.addPostForm = this.formBuilder.group({
      post_body: ['', [Validators.required, ]],
      post_title:['Arun',[Validators.required, ]],
      photo: [''],

    });

    this.commentForm = this.formBuilder.group({
      comment: ['',],
    });

  }
  get f(): { [key: string]: AbstractControl } {
    return this.addPostForm.controls;
  }

   // On file Select
   onChange(event:any) {
    this.file = event.target.files[0];
    console.log(this.file);
  }
  uploadFile(event:any) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);

      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.imageUrl = reader.result;
       console.log(this.imageUrl)
      }


    }
  }

  onLike(postid:string, i:number){
    this.isLike=!this.isLike;
    // this.initialCount += (this.isLike ? 1 : -1);

    let params ={
      post_id: postid,
    }
    this.addpostservice.likePost(params).subscribe(resp => {
      this.data.posts[i].likes_count += 1;
      this.data.posts[i].likes.push(this.currentUser);
      console.log(resp);
    })
  }

  onUnlike(postid:string, i:number){
    // this.initialCount += (this.isLike ? 1 : -1);

    let params ={
      post_id: postid,
    }
    this.addpostservice.unlikePost(params).subscribe(resp => {
      this.data.posts[i].likes_count -= 1;
      let index = this.data.posts[i].likes.indexOf(this.currentUser);
      this.data.posts[i].likes.splice(index,1);
      console.log(resp);
    })
  }

  fetchPost(){
    this.addpostservice.getPostList(this.currentPage, this.recordsPerPage).subscribe(res =>{
      // this.isLoadingSpinner = false;
      // this.totalRecords = typeof list.totalRecords === 'number' ? list.totalRecords : 1;
      let listPost;
      this.data = res['data'];
      console.log(this.data.posts._id);
      listPost=this.data
      // listPost.posts.forEach(Element => {
      //   console.log(Element);
      // });
    })
  }
  //on post
  addPost(){
    this.submitted = true;
    console.log(this.addPostForm.value);
    let data = {
      title: this.addPostForm.value.post_title,
      body: this.addPostForm.value.post_body,
      posted_by: '627e02f1fd5bf9a0cd3ef9a7',
      // image: this.addPostForm.value.image,
    }
    this.addpostservice.createPost(data).subscribe(resp => {
      console.log(resp);
      this.data.posts.push(resp.data);
    })
  }

  commentPost(post_id:string){
    this.submitted = true;
    console.log(this.addPostForm.value);
    let data = {
      comment: this.commentForm.value.comment,
    }
    this.addpostservice.createComment(data, post_id).subscribe(resp => {
      console.log(resp.data._id);
      this.comment_id = resp.data._id;
      this.commentForm.reset();
      // this.data(resp.data);
    })

  }
  btn_comment_post(){
    // if (this.value.trim()) {
    //   this.add.emit(this.value);
    //   this.value = '';
    // }
    this.comment=this.commentForm.value.comment;
    console.log(this.comment);
  }
  // on comment section
  onComment(){
    this.isComment=true;
  }


}
