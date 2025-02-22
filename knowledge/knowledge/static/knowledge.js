new Vue({
    el: '#starting',
    delimiters: ['${','}'],
    data: {
        contestants: [],
        categories: [],
        currentContestantIndex: 0,
        takingOverIndex: null,
        currentCategory: {},
        currentQuestion: {},
        loading: true,
        state: 'category',
        round_no: 1,
    },
    computed: {
        currentContestant: function () {
            let index = this.takingOverIndex || this.currentContestantIndex;
            return this.contestants[index];
        }
    },
    mounted: function() {
        this.getContestants();
        this.getCategories();
        window.addEventListener('keydown', this.keyHandler);
    },
    methods: {
        randomElement: function(array) {
            let index = Math.floor(Math.random() * array.length);
            return array[index];
        },
        getContestants: function() {
            let api_url = '/api/contestant/';
            this.loading = true;
            return this.$http.get(api_url)
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
            return this.$http.get(api_url)
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
            if (this.categories[i]['questions'].length > 0) {
                this.currentCategory = this.categories[i];
                this.currentQuestion = this.randomElement(this.currentCategory['questions']);
                this.state = 'question';
            }
        },
        backToCategories: function() {
            this.currentContestantIndex--;
            this.nextQuestion();
        },
        nextQuestion: function() {
            this.state = 'category';
            this.currentContestantIndex++;
            this.takingOverIndex = null;
            if (this.currentContestantIndex === this.contestants.length) {
                this.currentContestantIndex = 0;
                this.round_no++;
            }
        },
        keyHandler: function(event) {
            if (this.state === 'question' && !isNaN(event.key)) {
                let num = Number(event.key);
                if (num >= 0 && num <= this.currentCategory['max_points']) {
                    this.addAnswer(num);
                }
            }
            if (this.state === 'category' && event.key === 'x') {
                this.loading = true;
                this.$http.patch('/api/contestant/'+this.currentContestant.id+'/', {
                    excluded: true
                })
                    .then(() => {
                        this.loading = false;
                        this.getContestants().then(
                            () => {
                                this.currentContestantIndex--;
                                this.nextQuestion();
                            }
                        );
                    })
                    .catch((err) => {
                        this.loading = false;
                        console.log(err);
                    });
            }
        },
        addAnswer: function(points) {
            this.loading = true;
            this.$http.post('/api/answer/', {
                contestant: this.currentContestant.id,
                question: this.currentQuestion.id,
                points: points
            })
                .then(() => {
                    this.loading = false;
                    this.getContestants();
                    this.getCategories();
                    this.nextQuestion();
                })
                .catch((err) => {
                    this.loading = false;
                    console.log(err);
                });
        },
        takeOver: function (contestantIndex) {
            if (this.state === 'question' && this.currentContestantIndex !== contestantIndex) {
                this.takingOverIndex = contestantIndex;
            }
        }
    }
});
