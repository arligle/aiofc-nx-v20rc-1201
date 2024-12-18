import { Injectable } from '@nestjs/common';
import { OptimisticLockException } from '@aiofc/exceptions';
import { DataSource, EntitySubscriberInterface, UpdateEvent } from 'typeorm';

@Injectable()
/**
 * this subscriber works only with save method and doesn't work with update
 * */
export class OptimisticLockingSubscriber implements EntitySubscriberInterface {
  constructor(readonly dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  beforeUpdate(event: UpdateEvent<any>) {
    // To know if an entity has a version number, we check if versionColumn
    // is defined in the metadata of that entity.
    // event.databaseEntity doesn't work for update method

    if (event.metadata.versionColumn && event.entity && event.databaseEntity) {
      // Getting the current version of the requested entity update

      const versionFromUpdate = Reflect.get(
        event.entity,
        event.metadata.versionColumn.propertyName,
      );

      // Getting the entity's version from the database
      const versionFromDatabase =
        event.databaseEntity[event.metadata.versionColumn.propertyName];

      // they should match otherwise someone has changed it before
      if (versionFromDatabase !== versionFromUpdate) {
        throw new OptimisticLockException(versionFromDatabase);
      }
    }
  }
}
