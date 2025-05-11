<script lang="ts">
    import { enhance } from "$app/forms"; // Import the enhance action
</script>

Login
<form method="POST" use:enhance>
    <label>
        Email
        <input class="input" name="email" required />
    </label>
    <label>
        Password
        <input class="input" name="password" type="password" required />
    </label>
    <button class="btn">signup</button>
</form>
