from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    time_stamp = models.TextField()
    likes = models.IntegerField(default=0)
    id = models.TextField(primary_key=True)

    def serialize(self):
        return {
            "author": self.author.username,
            "content": self.content,
            "time_stamp": self.time_stamp,
            "likes": self.likes,
            "id": self.id
        }