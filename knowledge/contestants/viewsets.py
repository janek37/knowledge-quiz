from rest_framework import viewsets
from .models import Contestant, Answer
from .serializers import ContestantSerializer, AnswerSerializer


class ContestantViewSet(viewsets.ModelViewSet):
    queryset = Contestant.objects.filter(excluded=False)
    serializer_class = ContestantSerializer


class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
