import {
  Store,
  StoreDraft,
  ReferenceTypeId,
  StoreUpdateAction,
  StoreSetNameAction,
  ChannelReference,
  StoreSetDistributionChannelsAction,
  ChannelResourceIdentifier,
} from '@commercetools/platform-sdk'
import { Writable } from 'types'
import { getBaseResourceProperties } from '../helpers'
import { AbstractResourceRepository } from './abstract'
import { getReferenceFromResourceIdentifier } from './helpers'

export class StoreRepository extends AbstractResourceRepository {
  getTypeId(): ReferenceTypeId {
    return 'store'
  }

  create(projectKey: string, draft: StoreDraft): Store {
    const resource: Store = {
      ...getBaseResourceProperties(),
      key: draft.key,
      distributionChannels: this.transformChannels(
        projectKey,
        draft.distributionChannels
      ),
    }
    this.save(projectKey, resource)
    return resource
  }

  private transformChannels(
    projectKey: string,
    channels?: ChannelResourceIdentifier[]
  ) {
    if (!channels) return []

    return channels.map(ref =>
      getReferenceFromResourceIdentifier<ChannelReference>(
        ref,
        projectKey,
        this._storage
      )
    )
  }

  actions: Partial<
    Record<
      StoreUpdateAction['action'],
      (projectKey: string, resource: Writable<Store>, action: any) => void
    >
  > = {
    setName: (
      projectKey: string,
      resource: Writable<Store>,
      { name }: StoreSetNameAction
    ) => {
      resource.name = name
    },
    setDistributionChannels: (
      projectKey: string,
      resource: Writable<Store>,
      { distributionChannels }: StoreSetDistributionChannelsAction
    ) => {
      resource.distributionChannels = this.transformChannels(
        projectKey,
        distributionChannels
      )
    },
  }
}
