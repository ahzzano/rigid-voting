<script lang="ts">
    import { enhance } from "$app/forms";

    const { data } = $props();

    const deletePoll = async () => {
        const link = `/app/${data.id}/delete`;
        await fetch(link, {
            method: "POST",
        });
    };
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
<button onclick={deletePoll}> Delete Poll </button>
<br />

{#each data.questions as question}
    <div>
        <span>
            {question.text}
        </span>
        <form method="POST" action="?/add_choice" use:enhance>
            <input readonly hidden name="questionId" value={question.id} />
            <input class="input" name="choice" placeholder="new choice" />
            <button class="btn">Add</button>
        </form>

        <div>
            {#each question.choices as choice}
                <div>
                    {choice.content}
                    {choice.count}
                </div>
            {/each}
        </div>
    </div>
{/each}
