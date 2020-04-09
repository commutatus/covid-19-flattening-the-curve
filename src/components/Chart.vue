<script>
import { Line } from "vue-chartjs";
export default {
  extends: Line,
  props: ["chartdata", "chartoptions"],
  mounted() {
    this.renderChart(this.chartdata, this.chartoptions);
  }
};
</script>

<style>
</style>