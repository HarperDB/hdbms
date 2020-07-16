import queryLMS from '../queryLMS';
import appState from '../../state/appState';
import addError from './addError';
import config from '../../config';
import buildRadioSelectStorageOptions from '../../methods/products/buildRadioSelectStorageOptions';
import buildRadioSelectProductOptions from '../../methods/products/buildRadioSelectProductOptions';

export default async ({ auth, customer_id, stripe_id }) => {
  let response = null;

  try {
    response = await queryLMS({
      endpoint: 'getSubscriptions',
      method: 'POST',
      payload: {
        customer_id,
        stripe_id,
      },
      auth,
    });

    if (response.error) return false;

    let subscriptions = {
      cloudCompute: [],
      cloudStorage: [],
      localCompute: [],
    };

    response.inactive.map((s) =>
      s.items.data
        .filter((i) => i.price.product.name === 'HarperDB Cloud Monthly (Beta)')
        .map((i) =>
          subscriptions.cloudCompute.push({
            subscription_name: s.metadata?.name,
            subscription_id: i.subscription,
            quantity: i.quantity,
            ...i.plan,
          })
        )
    );

    response.inactive.map((s) =>
      s.items.data
        .filter((i) => i.price.product.name === 'HarperDB Cloud Storage')
        .map((i) =>
          subscriptions.cloudStorage.push({
            subscription_name: s.metadata?.name,
            subscription_id: i.subscription,
            quantity: i.quantity,
            ...i.plan,
          })
        )
    );

    response.inactive.map((s) =>
      s.items.data
        .filter((i) => i.price.product.name === 'HarperDB Local Annual')
        .map((i) =>
          subscriptions.localCompute.push({
            subscription_name: s.metadata?.name,
            subscription_id: i.subscription,
            quantity: i.quantity,
            ...i.plan,
          })
        )
    );

    const cloudStorage =
      subscriptions.cloudStorage.length && buildRadioSelectStorageOptions(subscriptions.cloudStorage).sort((a, b) => a.value.data_volume_size - b.value.data_volume_size);
    const cloudCompute =
      subscriptions.cloudCompute.length && buildRadioSelectProductOptions(subscriptions.cloudCompute).sort((a, b) => a.value.ram_allocation - b.value.ram_allocation);
    const localCompute =
      subscriptions.localCompute.length && buildRadioSelectProductOptions(subscriptions.localCompute).sort((a, b) => a.value.ram_allocation - b.value.ram_allocation);

    subscriptions = {
      cloudStorage,
      cloudCompute,
      localCompute,
    };

    return appState.update((s) => {
      s.subscriptions = subscriptions;
    });
  } catch (e) {
    console.log('getSubscriptions', e);
    return addError({
      type: 'lms data',
      status: 'error',
      url: config.lms_api_url,
      operation: 'getSubscriptions',
      error: { catch: e.toString() },
    });
  }
};
