from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='images', null=True)

    def serialize(self):
        likes = PostLike.objects.filter(post=self).count()
        data = {
            "author": self.author.username,
            "content": self.content,
            "time_stamp": self.created_at,
            "id": self.id,
            "likes": likes,
        }
        if self.image:
            data["image"] = self.image.url
        return data


class Relationship(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='follower')
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name='following')


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        likes = CommentLike.objects.filter(comment=self).count()
        return {
            "author": self.author.username,
            "content": self.content,
            "time_stamp": self.created_at,
            "id": self.id,
            "likes": likes,
        }


class PostLike(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    liker = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        unique_together = ["post", "liker"]


class CommentLike(models.Model):
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    liker = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        unique_together = ["comment", "liker"]
