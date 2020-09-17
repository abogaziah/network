
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API Routes
    path("getPosts", views.get_posts, name="all_posts"),
    path("getProfile/<str:username>", views.get_profile, name="profile"),
    path("submitPost", views.submit_post, name="submit_post"),
    path("submitComment", views.submit_comment, name="submit_comment"),
    path("submitPostLike", views.submit_post_like, name="submit_post_like")
]
