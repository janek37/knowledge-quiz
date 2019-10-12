from rest_framework import serializers
from .models import Contestant, Answer


class ContestantSerializer(serializers.ModelSerializer):
    points = serializers.IntegerField(source='get_points', read_only=True)

    class Meta:
        model = Contestant
        fields = ['name', 'points', 'excluded', 'id']


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = '__all__'
