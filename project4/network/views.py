from django.contrib.auth import authenticate, login, logout, get_user
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.http import JsonResponse
from django.urls import reverse
from .models import *
from django.views.decorators.csrf import csrf_exempt
import json


def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


def get_posts(request):
    if request.method == "GET":
        response = []
        user = get_user(request)
        posts = Post.objects.all()
        posts = posts.order_by("-created_at").all()
        for post in posts:
            liked = PostLike.objects.filter(liker=user, post=post).exists()
            data_dict = post.serialize()
            data_dict["liked"] = liked
            response.append(data_dict)
        return JsonResponse(response, safe=False)


def get_comments(request):
    if request.method == "GET":
        response = []
        user = get_user(request)
        post_id = request.GET.get('id', '')
        post = Post.objects.get(id=post_id)
        comments = Comment.objects.filter(post=post)
        comments = comments.order_by("-created_at").all()
        for comment in comments:
            liked = CommentLike.objects.filter(liker=user, comment=comment).exists()
            data_dict = comment.serialize()
            data_dict["liked"] = liked
            response.append(data_dict)
        return JsonResponse(response, safe=False)


@csrf_exempt
def submit_post(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user = get_user(request)
        content = data["content"]
        try:
            post = Post(author=user, content=content)
            post.save()
            return JsonResponse({"message": "Posted"}, status=201)
        except IntegrityError:
            return render(request, "network/index.html", {
                "message": "invalid"
            })


@csrf_exempt
def submit_post_like(request):
    if request.method == "POST":
        data = json.loads(request.body)
        post_id = data["id"]
        user = get_user(request)
        post = Post.objects.get(id=post_id)
        if data['type'] == 'like':
            try:
                like = PostLike(liker=user, post=post)
                like.save()
                return JsonResponse({"message": "liked"}, status=201)
            except IntegrityError:
                return JsonResponse({"message": "invalid"}, status=201)
        else:
            try:
                like = PostLike.objects.get(liker=user, post=post)
                like.delete()
                return JsonResponse({"message": "unliked"}, status=201)
            except IntegrityError:
                return JsonResponse({"message": "invalid"}, status=201)


@csrf_exempt
def get_profile(request, username):
    if request.method == "GET":
        response = []
        user = User.objects.get(username=username)
        posts = Post.objects.filter(author=user)
        posts = posts.order_by("-created_at").all()
        for post in posts:
            liked = PostLike.objects.filter(liker=user, post=post).exists()
            data_dict = post.serialize()
            data_dict["liked"] = liked
            response.append(data_dict)
        return JsonResponse(response, safe=False)


@csrf_exempt
def submit_comment(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user = get_user(request)
        content = data["content"]
        post_id = data["postId"]
        post = Post.objects.get(id=post_id)
        try:
            comment = Comment(author=user, content=content, post=post)
            comment.save()
            return JsonResponse({"message": "Posted"}, status=201)
        except IntegrityError:
            return render(request, "network/index.html", {
                "message": "invalid"
            })
