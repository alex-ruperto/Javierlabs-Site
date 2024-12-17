using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Serilog;

namespace AlexBotAPI.Services;

public class KeyVaultService
{
    private readonly SecretClient? _secretClient;

    public KeyVaultService()
    {
        var clientId = Environment.GetEnvironmentVariable("JLabsClientId");
        var tenantId = Environment.GetEnvironmentVariable("JLabsTenantId");
        var clientSecret = Environment.GetEnvironmentVariable("JLabsClientSecret");
        var vaultUrl = Environment.GetEnvironmentVariable("JLabsKeyVaultUrl");
        
        try
        {
            var credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
            _secretClient = new SecretClient(new Uri(vaultUrl), credential);
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Error occured while initializing Azure Key Vault Client.");
            throw;
        }
    }

    public async Task<string?> GetSecret(string secretName)
    {
        try
        {
            KeyVaultSecret secret = await _secretClient.GetSecretAsync(secretName);
            return secret.Value;
        }
        catch (AuthenticationFailedException ex)
        {
            Log.Error(ex, $"Authentication failed while attempting to retrieve the secret: {secretName}");
            return null;
        }
        catch (Exception ex)
        {
            Log.Error(ex, $"Failed to retrieve the secret {secretName}");
            return null;
        }
    }
}