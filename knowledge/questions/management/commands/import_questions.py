from pathlib import Path
from django.core.management.base import BaseCommand, CommandError
from django.db.models import Max

from questions.models import Question, Category


class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def add_arguments(self, parser):
        parser.add_argument('tsv_dir')
        parser.add_argument('sheet_name')

    def handle(self, *args, **options):
        count = 0
        tsv_path = Path(options['tsv_dir'])

        for category in Category.objects.all():
            file_path = tsv_path / ('%s - %s.tsv' % (options['sheet_name'], category.name))
            for i, line in enumerate(file_path.open()):
                if i == 0:
                    continue
                question_text = line.strip().split('\t', 1)[0]
                index = (category.questions.aggregate(max=Max('index'))['max'] or 0) + 1
                Question.objects.create(category=category, content=question_text.strip(), index=index)
                count += 1

        self.stdout.write(self.style.SUCCESS('Successfully imported %s questions' % count))
