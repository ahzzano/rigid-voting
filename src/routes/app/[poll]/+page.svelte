<script lang="ts">
    import { enhance } from "$app/forms";
    import type { Poll } from "$lib/db/schema";

    const { data } = $props();

    console.log(data);
</script>

<div>
    <a href="/app">Go Back</a>
</div>

{data.pollname}

{data.open}

<form method="POST" action="?/add_question" use:enhance>
    Question <input class="input" name="question" />
    <button>Add</button>
</form>
<button
    onclick={async () => {
        await fetch(`/app/${data.id}/delete`, {
            method: "POST",
        });
    }}
>
    Delete Poll
</button>
<br />

{#each data.questions as question}
    <div>
        {question.question}
        <form method="POST" action="?/add_choice" use:enhance>
            <input readonly hidden name="questionId" value={question.id} />
            <input class="input" name="choice" placeholder="new choice" />
            <button class="btn">Add</button>
        </form>

        {#each question.choices as choice}
            <div>
                {choice.content}
                {choice.count}
            </div>
        {/each}
    </div>
{/each}
