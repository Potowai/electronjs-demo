<template>
  <div id="loading">
    <img class="img" src="/src/assets/images/spinner.gif" alt="loading..." width="200" />
  </div>
</template>

<script>
export default {
  name: 'LoadingPage',
  data() {
    return {
      progress: 0,
      currentStep: 'Initialisation...',
      steps: [
        'Initialisation...',
        'Chargement des composants...',
        "Configuration de l'interface...",
        'Connexion aux services...',
        'Prêt !',
      ],
      currentStepIndex: 0,
    };
  },
  mounted() {
    this.startLoading();
  },
  methods: {
    startLoading() {
      const totalSteps = this.steps.length;
      const stepDuration = 800; // ms par étape
      const progressIncrement = 100 / totalSteps;

      const interval = setInterval(() => {
        if (this.currentStepIndex < totalSteps - 1) {
          this.currentStepIndex++;
          this.currentStep = this.steps[this.currentStepIndex];
          this.progress = Math.min(100, this.progress + progressIncrement);
        } else {
          clearInterval(interval);
          this.progress = 100;
          this.currentStep = this.steps[this.steps.length - 1];

          // Attendre un peu avant de signaler que c'est prêt
          setTimeout(() => {
            this.$emit('loading-complete');
          }, 500);
        }
      }, stepDuration);
    },
  },
};
</script>
<style>
#loading {
  z-index: 1000;
  background-color: white;
  text-align: center;
  line-height: 100vh;
}
</style>
