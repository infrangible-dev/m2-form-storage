<?php

declare(strict_types=1);

namespace Infrangible\FormStorage\Block\Adminhtml\Form\Field;

use Magento\Config\Block\System\Config\Form\Field\FieldArray\AbstractFieldArray;

/**
 * @author      Andreas Knollmann
 * @copyright   2014-2026 Softwareentwicklung Andreas Knollmann
 * @license     http://www.opensource.org/licenses/mit-license.php MIT
 */
class Forms extends AbstractFieldArray
{
    protected function _prepareToRender()
    {
        $this->addColumn(
            'selector',
            ['label' => __('Selector'), 'style' => 'width:250px;', 'class' => 'required-entry']
        );
        $this->addColumn(
            'storage_name',
            ['label' => __('Storage Name'), 'style' => 'width:250px;']
        );
        $this->addColumn(
            'layout_handle',
            ['label' => __('Layout Handle'), 'style' => 'width:250px;']
        );

        $this->_addAfter = false;
        $this->_addButtonLabel = __('Add');
    }
}
