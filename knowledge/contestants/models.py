from django.db import models

from questions.models import Question


class Contestant(models.Model):
    name = models.CharField(max_length=64)
    excluded = models.BooleanField(default=False)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return self.name

    def get_points(self):
        return self.answer_set.aggregate(points=models.Sum('points'))['points'] or 0


class Answer(models.Model):
    contestant = models.ForeignKey(Contestant, on_delete=models.CASCADE)
    question = models.OneToOneField(Question, on_delete=models.CASCADE)
    points = models.IntegerField()
