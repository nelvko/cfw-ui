import obj from './src/mock/provider.json' with { type: "json" };
function formatProxyProviders(providersInput) {
    const keys = Object.keys(providersInput);
    const proxyProviders = [];
    const providerProxyRecord = {};

    for (let i = 0; i < keys.length; i++) {
        const provider = providersInput[keys[i]];
        if (provider.name === 'default' || provider.vehicleType === 'Compatible') {
            continue;
        }
        const proxiesArr = provider.proxies;
        const names = [];
        for (let j = 0; j < proxiesArr.length; j++) {
            const proxy = proxiesArr[j];
            providerProxyRecord[proxy.name] = { ...proxy, __provider: provider.name };
            names.push(proxy.name);
        }

        // mutate directly
        provider.proxies = names;
        proxyProviders.push(provider);
    }

    return { proxyProviders, providerProxyRecord };
}
const { proxyProviders, providerProxyRecord } = formatProxyProviders(obj.providers)
console.log(proxyProviders, providerProxyRecord);

