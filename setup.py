import setuptools

# Đọc README.md để làm mô tả dài
with open('README.md', encoding='utf-8') as f:
    long_description = f.read()

setuptools.setup(
    name="inventree-provisioning-plugin",
    version="0.1.0",
    author="Bin",
    author_email="bin.nguyen@digitalfortress.dev",
    description="Plugin to add provisioning status and IMEI to Parts, and a provisioning log.",
    long_description=long_description,
    long_description_content_type='text/markdown',
    keywords="inventree provisioning imei",
    # url="https://github.com/yourusername/inventree-provisioning-plugin",
    license="MIT",
    packages=setuptools.find_packages(),
    install_requires=[
        # Liệt kê các thư viện phụ thuộc khác nếu có
    ],
    setup_requires=[
        "wheel",
        "twine",
    ],
    python_requires=">=3.9",
    entry_points={
        "inventree_plugins": [
            "ProvisioningPlugin = provisioning_plugin.ProvisioningPlugin:ProvisioningPlugin"
        ]
    },
    include_package_data=True,
)