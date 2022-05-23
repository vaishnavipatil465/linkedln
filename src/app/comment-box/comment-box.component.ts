import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { AddPostService } from '../add-post/add-post.service';

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.css']
})
export class CommentBoxComponent implements OnInit {
  replyForm:any;
  isReplyLike=false;
  isReply=false;
  onReplyComment=false;
  value:any;
  submitted = false;
  content:any;
  replyComment=false;
  @Output() add = new EventEmitter<string>();
  @Input() comment:any;
  @Input() post_id!:string;
  @Input() comment_id!:string;




  constructor(
     private formBuilder: FormBuilder,
     private addpostservice:AddPostService,
    ) { }

  ngOnInit(): void {
    this.replyForm = this.formBuilder.group({
      comment1: ['',],
    });
    console.log(this.comment);
  }
 //reply on like
 onReplyLike(){
  this.isReplyLike=!this.isReplyLike;

  this.addpostservice.likeReplyPost(this.post_id, this.comment_id).subscribe(resp => {
    console.log(resp.data._id);
    // this.comment_id = resp.data._id;
    // this.data(resp.data);
  })


}

//reply on comment
onReply(){
  this.isReply=true;
}


//on reply comment post
replyPost(){
  this.submitted = true;
  this.onReplyComment=true;

  console.log(this.replyForm.value);
  let data = {
    content: this.replyForm.value.comment1,
  }
  this.addpostservice.makeReply(data, this.post_id, this.comment_id).subscribe(resp => {
    console.log(resp.data._id);
    // this.comment_id = resp.data._id;
    this.content = data.content;
    this.replyForm.reset();

    // this.data(resp.data);
  })
}



}
