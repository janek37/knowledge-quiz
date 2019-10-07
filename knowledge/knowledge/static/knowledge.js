Vue.http.headers.common['X-CSRFToken'] = "{{ csrf_token }}";
new Vue({
    el: '#starting',
    delimiters: ['${','}'],
    data: {
        contestants: [],
        categories: [],
        currentContestantIndex: 0,
        currentCategory: {},
        currentQuestion: {},
        loading: true,
        state: 'category',
    },
    mounted: function() {
        this.getContestants();
        this.getCategories();
    },
    methods: {
        getContestants: function() {
            let api_url = '/api/contestant/';
            this.loading = true;
            this.$http.get(api_url)
                .then((response) => {
                    this.contestants = response.data;
                    this.loading = false;
                })
                .catch((err) => {
                    this.loading = false;
                    console.log(err);
                });
        },
        getCategories: function() {
            let api_url = '/api/category/';
            this.loading = true;
            this.$http.get(api_url)
                .then((response) => {
                    this.categories = response.data;
                    this.loading = false;
                })
                .catch((err) => {
                    this.loading = false;
                    console.log(err);
                })
        },
        chooseCategory: function(i) {
            if (this.categories[i].questions.length > 0) {
                this.currentCategory = this.categories[i];
                this.state = 'question';
            }
        },
        chooseQuestion: function(i) {
            this.currentQuestion = this.currentCategory['questions'][i];
            this.state = 'answer';
        },
        nextQuestion: function() {
            this.state = 'category';
            this.currentContestantIndex++;
            if (this.currentContestantIndex === this.contestants.length)
                this.currentContestantIndex = 0;
        },
        addAnswer: function (points) {
            if (points > 0) {
                this.loading = true;
                this.$http.post('/api/answer/', {
                    contestant: this.contestants[this.currentContestantIndex].id,
                    question: this.currentQuestion.id,
                    points: points
                })
                    .then(() => {
                        this.loading = true;
                        this.getContestants();
                        this.getCategories();
                        this.nextQuestion();
                    })
                    .catch((err) => {
                        this.loading = false;
                        console.log(err);
                    });
            } else {
                this.nextQuestion();
            }
        }
    }
});
