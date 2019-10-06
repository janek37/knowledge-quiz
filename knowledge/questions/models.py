from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=64)
    index = models.IntegerField(unique=True)
    max_points = models.IntegerField()

    class Meta:
        ordering = ['index']

    def __str__(self):
        return self.name

    def available_questions(self):
        return self.questions.filter(answer=None)


class Question(models.Model):
    category = models.ForeignKey(Category, related_name='questions', on_delete=models.CASCADE)
    index = models.IntegerField()
    content = models.TextField()

    class Meta:
        unique_together = ('category', 'index')
        ordering = ['category', 'index']
