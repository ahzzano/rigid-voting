<script lang="ts">
    import type { PageData } from "../$types";

    const {
        data,
    }: {
        data: {
            pollname: string;
            open: boolean;
            questions: {
                id: number;
                poll: number;
                question: string;
                order: number;
            }[];
        };
    } = $props();
</script>

<div>
    <a href="/app">Go Back</a>
</div>

{data.pollname}

{data.open}

<form method="POST" action="?/add_question">
    Question <input class="input" />
    <button>Add</button>
</form>
