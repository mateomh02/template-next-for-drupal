<?php

namespace Drupal\content_types_info\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Entity\EntityFieldManagerInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Entity\EntityDisplayRepositoryInterface;
use Drupal\field_group\FieldGroupRepositoryInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Controller for retrieving content types and fields information.
 */
class ContentTypesInfoController extends ControllerBase {

  protected $entityTypeManager;
  protected $entityFieldManager;
  protected $entityDisplayRepository;

  public function __construct(EntityTypeManagerInterface $entity_type_manager, EntityFieldManagerInterface $entity_field_manager, EntityDisplayRepositoryInterface $entity_display_repository) {
    $this->entityTypeManager = $entity_type_manager;
    $this->entityFieldManager = $entity_field_manager;
    $this->entityDisplayRepository = $entity_display_repository;
  }

  public function typesInfo() {
    $content_types = $this->entityTypeManager->getStorage('node_type')->loadMultiple();
    $types_info = [];

    foreach ($content_types as $content_type) {
      $fields_info = [];
      $fields = $this->entityFieldManager->getFieldDefinitions('node', $content_type->id());
      foreach ($fields as $field_name => $field_definition) {
        $field_info = [
          'label' => $field_definition->getLabel(),
          'type' => $field_definition->getType(),
          'description' => $field_definition->getDescription(),
        ];

        // Check if the field is an entity reference field.
        if ($field_definition->getType() === 'entity_reference') {
          $target_entity_type_id = $field_definition->getSetting('target_type');
          $target_entity_type = $this->entityTypeManager->getDefinition($target_entity_type_id);
          $field_info['target_entity_type'] = $target_entity_type->getLabel();
        }

        // Check if the field is displayed in a specific view mode and get its weight.
        $display = $this->entityDisplayRepository->getFormDisplay('node', $content_type->id(), 'default');
        if ($display->getComponent($field_name)) {
          $display_weight = $display->getComponent($field_name)['weight'];
          $field_info['display_weight'] = $display_weight;
        }

        $fields_info[$field_name] = $field_info;
      }
      $types_info[$content_type->id()] = [
        'label' => $content_type->label(),
        'fields' => $fields_info,
      ];
    }

    return new JsonResponse($types_info);
  }

}
