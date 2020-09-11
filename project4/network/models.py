from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import datetime

class User(AbstractUser):
    pass


class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    time_stamp = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField(default=0)

    def serialize(self):
        return {
            "author": self.author.username,
            "content": self.content,
            "time_stamp": self.time_stamp.strftime("%m/%d/%Y, %H:%M:%S"),
            "likes": self.likes
        }
