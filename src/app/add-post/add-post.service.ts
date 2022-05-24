import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AddPostService {

  constructor(private http:HttpClient) { }

  createPost(data:any) {
    return this.http.post<{data:any,message:string}>(`${environment.api_url}/post/create-post`, data);
  }
  getPostList(page?:number, recordsPerPage?:number){
    return this.http.get<{message: string, data: any }>(`${environment.api_url}/post/post-list?page=${page}&recordsPerPage=${recordsPerPage}`);
  }

  likePost(params: any) {
    return this.http.put<{message: string, data: any }>(`${environment.api_url}/post/like-post`, params);
  }

  unlikePost(params: any) {
    return this.http.put<{message: string, data: any }>(`${environment.api_url}/post/unlike-post`, params);
  }
  createComment(data:any,post_id:string) {
    return this.http.post<{data:any,message:string}>(`${environment.api_url}/post/${post_id}/comments/create`, data);
  }

  makeReply(data:any,post_id:string, comment_id:string) {
    return this.http.post<{data:any,message:string}>(`${environment.api_url}/post/${post_id}/${comment_id}/reply/create`, data);
  }

  likeReplyPost(post_id:string, comment_id:string) {
    return this.http.put<{message: string, data: any }>(`${environment.api_url}/post/${post_id}/${comment_id}/like-comment`,{} );
  }
}
