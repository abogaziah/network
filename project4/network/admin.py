from django.contrib import admin
from .models import *
# Register your models here.
models = (Post, User, PostLike, CommentLike, Comment)
admin.site.register(models)
