from rest_framework import serializers
from .models import Question, Category


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['index', 'content', 'id']


class CategorySerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(source='available_questions', many=True, read_only=True)

    class Meta:
        model = Category
        fields = ['name', 'questions', 'max_points']
