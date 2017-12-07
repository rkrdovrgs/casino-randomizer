import { inject } from "aurelia-dependency-injection";
import { Project, ProjectItem, CLIOptions, UI } from "aurelia-cli";

@inject(Project, CLIOptions, UI)
export default class ViewGenerator {
    constructor(private project: Project, private options: CLIOptions, private ui: UI) { }

    execute() {
        return this.ui
            .ensureAnswer(this.options.args[0], "What is the path of the subject under test (e.g. regulatory/form/regulatory-main)?")
            .then((path: string) => {
                if (path.endsWith(".ts")) {
                    path = path.substr(0, path.length - 3);
                }

                let name = path.split("/").pop();
                let fileName = this.project.makeFileName(name);
                let className = this.project.makeClassName(name);

                this.project.tests.add(
                    ProjectItem.text(`${path}.spec.ts`, this.generateJSSource(className, path)),
                    ProjectItem.text(`${path}.spec.data.ts`, this.generateMockDataSource())
                );

                return this.project.commitChanges()
                    .then(() => this.ui.log(`Created ${fileName}.`));
            });
    }

    generateJSSource(className: string, path: string) {
        return `import { GlobalContainer } from "test-utils/helpers/global-container";
import { ${className} } from "${path}";

/// @todo: Import mock util
//import { Mock } from "ts-moq/moq";

/// @todo: Import test dependencies
//import { FooService } from "dataservices/foo-service";

// @todo: Import mock data
//import mockData from "test/unit/${path}.spec.data";

describe("The ${className} module", () => {
    let sut: ${className},
        //fooServiceMock: Mock<FooService>,
        container: GlobalContainer;

    beforeEach(() => {
        // @todo: Setup mocks for test dependencies
        /*
        fooServiceMock = new Mock<FooService>();
        fooServiceMock.spyOn(x => x.getFoo)
            .and.callFake.promise.resolve(() => mockData.foo);
        */

        container = new GlobalContainer();
            
        // @todo: Register mocks
        //container.registerInstance(FooService, fooServiceMock.object);
            
        //Get SUT from the container
        sut = container.get(${className});
    });

    describe("when [some action is carried out]", () => {
        it("should [trigger a particular set of observable consequences]", () => {
            expect(sut.message).toEqual("Hello World!");
        });
    });
});
`;
    }

    generateMockDataSource() {
        return `export default {
    foo: [
        {
            id: 1,
            label: "FPO"
        }
    ]
};
`;
    }