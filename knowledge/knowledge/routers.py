from rest_framework import routers

from contestants.viewsets import ContestantViewSet, AnswerViewSet
from questions.viewsets import QuestionViewSet, CategoryViewSet

router = routers.DefaultRouter()

router.register(r'question', QuestionViewSet)
router.register(r'contestant', ContestantViewSet)
router.register(r'category', CategoryViewSet)
router.register(r'answer', AnswerViewSet)
