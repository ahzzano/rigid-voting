<script lang="ts">
    // const userData = $
    import type { PageData } from "./$types";
    import { enhance } from "$app/forms";
    let { data }: { data: PageData } = $props();
    console.log(data);
</script>

User Settings
<div></div>

Edit Info
<form method="POST" use:enhance action="?/insert">
    <input name="firstName" class="input" />
    <input name="lastName" class="input" />
    <button class="btn">Update</button>
</form>
