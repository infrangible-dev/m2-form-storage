<?php

declare(strict_types=1);

namespace Infrangible\FormStorage\Block;

use FeWeDev\Base\Variables;
use Infrangible\Core\Helper\Stores;
use Magento\Framework\Exception\LocalizedException;
use Magento\Framework\Serialize\Serializer\Json;
use Magento\Framework\View\Element\Template;

/**
 * @author      Andreas Knollmann
 * @copyright   2014-2026 Softwareentwicklung Andreas Knollmann
 * @license     http://www.opensource.org/licenses/mit-license.php MIT
 */
class Forms extends Template
{
    /** @var Stores */
    protected $storeHelper;

    /** @var Variables */
    protected $variables;

    /** @var Json */
    protected $serializer;

    public function __construct(
        Template\Context $context,
        Stores $storeHelper,
        Variables $variables,
        Json $serializer,
        array $data = []
    ) {
        parent::__construct(
            $context,
            $data
        );

        $this->storeHelper = $storeHelper;
        $this->variables = $variables;
        $this->serializer = $serializer;
    }

    public function getFormData(): array
    {
        $formsConfig = $this->storeHelper->getStoreConfig('infrangible_formstorage/settings/forms');

        if ($this->variables->isEmpty($formsConfig)) {
            return [];
        }

        try {
            $handles = $this->getLayout()->getUpdate()->getHandles();
        } catch (LocalizedException $exception) {
            $handles = [];
        }

        $forms = $this->serializer->unserialize($formsConfig);

        $formData = [];

        foreach ($forms as $form) {
            $selector = $form['selector'];
            $storageName = $form['storage_name'];
            $layoutHandle = $form['layout_handle'];

            if (!$this->variables->isEmpty($layoutHandle)) {
                $skip = true;

                foreach ($handles as $handle) {
                    if ($handle === $layoutHandle) {
                        $skip = false;
                    }
                }

                if ($skip) {
                    continue;
                }
            }

            $formData[$selector] = $this->variables->isEmpty($storageName) ? '{}' :
                $this->serializer->serialize(['storageName' => $storageName]);
        }

        return $formData;
    }
}
